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
  const connections = room.getConnections()
  const result = []
  for (const c of connections) {
    result.push(c)
  }
  return result
}

export default class Server implements Party.Server {
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

    console.log('name', this.room.name)
    console.log('id', this.room.id)

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
      conn.send(JSON.stringify(availableRooms))
    }

    // let's send a message to the connection
  }

  onMessage(message: string, sender: Party.Connection) {
    // as well as broadcast it to all the other connections in the room...
    this.room.broadcast(
      btoa(JSON.stringify({ message: message, sender: sender.id })),
      // ...except for the connection it came from
      [sender.id]
    )
  }
}

Server satisfies Party.Worker
