import { variables } from "@/variables"

export const useSetTheme = () => {
    const setTheme = () => {
        document.documentElement.setAttribute('data-bs-theme', localStorage.getItem(variables.THEME_LOCALSTORAGE) || 'dark')
    }
    return setTheme;
}