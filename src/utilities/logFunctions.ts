export function consoleError(...error: any) {
  for (let index = 0; index < error.length; index++) {
    console.error("❌❌❌", error, "❌❌❌");
  }
}

export function consoleWarn(...warning: any) {
  for (let index = 0; index < warning.length; index++) {
    console.warn("❕❕❕", warning, "❕❕❕");
  }
}

export function consoleLog(...log: any) {
  for (let index = 0; index < log.length; index++) {
    console.log("👉👉👉", log[index], "👈👈👈");
  }
}
