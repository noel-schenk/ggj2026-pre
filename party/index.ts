import * as Party from 'partykit/server'

const rooms: Map<Party.Room, number> = new Map()
const LobbyName = 'lobby'

interface RoomData {
  id: string
  name: string
  players: number
  last: number
}

function getRoomConnectionsAsArray(room: Party.Room) {
  return [...room.getConnections()]
}

export default class Server implements Party.Server {
  authority: null | string = null

  constructor(readonly room: Party.Room) {
    if (!rooms.has(room) && room.name != LobbyName) {
      console.log('adding room:', room.id, room.name)
      rooms.set(room, Date.now())
    }
  }

  onClose(connection: Party.Connection): void | Promise<void> {
    const connections = getRoomConnectionsAsArray(this.room).filter(
      c => c.id !== connection.id
    )

    if (connections.length == 0) {
      rooms.delete(this.room)
      this.authority = null
    }

    if (this.authority === connection.id) {
      // the authority left pick new one!
      if (connections.length > 0) {
        const connection = connections.pop()!
        this.authority = connection.id
        this.room.broadcast(
          encode({
            data: {
              authority: this.authority,
            },
            type: 'authority-sync',
          } as MessageLayout<'authority-sync'>)
        )
      } else {
        this.authority = null
      }
    }
  }

  onConnect(conn: Party.Connection, ctx: Party.ConnectionContext) {
    // A websocket just connected!
    console.log(
      `
        Connected:
        id: ${conn.id}
        room: ${this.room.id}
        url: ${new URL(ctx.request.url).pathname}`
    )
    if (this.authority === null) {
      this.authority = conn.id
    }

    console.log('name', this.room.name)
    console.log('id', this.room.id)

    conn.send(
      encode({
        data: {
          authority: this.authority,
        },
        type: 'authority-sync',
      } as MessageLayout<'authority-sync'>)
    )

    if (this.room.id === LobbyName) {
      const availableRooms: RoomData[] = []
      rooms.forEach((lastInteracted, room) => {
        availableRooms.push({
          id: room.id,
          last: lastInteracted,
          name: room.name,
          players: getRoomConnectionsAsArray(room).length,
        } as RoomData)
      })
      console.log(availableRooms)
    }

    // let's send a message to the connection
  }

  onMessage(message: string, sender: Party.Connection) {
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      message,
      // ...except for the connection it came from
      [sender.id]
    )
  }
}

export const encode = <T extends keyof MessageTypes>(
  object: MessageLayout<T>
) => btoa(JSON.stringify(object))

export const decode = (message: any) => JSON.parse(atob(message))

Server satisfies Party.Worker
