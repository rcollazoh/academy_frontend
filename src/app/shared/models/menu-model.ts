export interface Menu {
  text: string,
  icon: string,
  routerLink?: string,
  children?: MenuItem[],
  role: string[]
}
export interface MenuItem {
  text: string,
  icon: string,
  routerLink: string
}