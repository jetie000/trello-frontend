

export const useSetTheme = () => {
  const setTheme = () => {
    document.documentElement.setAttribute(
      "data-bs-theme",
      localStorage.getItem(localStorage.THEME_LOCALSTORAGE) || "dark"
    )
  }
  return setTheme
}
