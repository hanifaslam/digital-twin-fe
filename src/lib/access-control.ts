export const hasAccessToMenuItem = (
  userAccess: string[] | undefined,
  middleware: string[] | undefined,
): boolean => {
  if (!middleware || middleware.length === 0) {
    return true;
  }

  if (!userAccess || userAccess.length === 0) {
    return false;
  }

  return middleware.every((permission) => userAccess.includes(permission));
};

export const filterMenuItemsByAccess = <
  T extends { middleware?: string[]; children?: T[] },
>(
  menuItems: T[],
  userAccess: string[] | undefined,
): T[] => {
  return menuItems
    .filter((item) => hasAccessToMenuItem(userAccess, item.middleware))
    .map((item) => ({
      ...item,
      children: item.children
        ? filterMenuItemsByAccess(item.children, userAccess)
        : undefined,
    }))
    .filter((item) => {
      if (item.children && item.children.length === 0) {
        return false;
      }
      return true;
    });
};
