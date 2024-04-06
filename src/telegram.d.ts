export {};
declare global {
  interface Window {
    Telegram: any; // Замените `any` на более конкретный тип, если он у вас есть
  }
}