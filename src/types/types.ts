export type PageKey = "painel";

export default interface AppSettings {
  painelToken: string;
  kiosk: boolean;
  lastPage: PageKey;
}
