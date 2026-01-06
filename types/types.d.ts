declare interface MessageLayout<T extends keyof MessageTypes> {
  data: MessageTypes[T]
  type: T
}

declare interface MessageTypes {
  'authority-sync': {
    authority: string
  }
  'multiplayer-sync': any
  'multiplayer-spawn': any
}
