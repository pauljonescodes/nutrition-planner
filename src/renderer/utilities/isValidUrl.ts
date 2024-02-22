export function isValidUrl(value?: string) {
    if (value === undefined) {
      return false;
    }

    const expression =
      /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(expression);
    if (value.match(regex)) {
      return true;
    } else {
      return false;
    }
  }
