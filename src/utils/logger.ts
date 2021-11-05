export enum LoggerType {
  confirm = 'confirm',
  error = 'error'
}

type LoggerTypeStrings = keyof typeof LoggerType;

export default function logger(type: LoggerTypeStrings, message: string): void {
  const symbols = {
    'confirm': '✔️',
    'error': '✖️'
  }

  console.log(`${symbols[type]} ${message}`)
}
