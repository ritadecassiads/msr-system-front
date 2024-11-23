const USER_SALE = "user_sale";

export abstract class StorageUtils {
  static setUserSale(username: string): void {
    sessionStorage.setItem(USER_SALE, username);
  }

  static getUserSale(): string | null {
    return sessionStorage.getItem(USER_SALE);
  }
}
