import "./NotFound.scss"
import { useSelector } from "react-redux"
import { RootStateStore } from "@/store/store"
import { languages } from "@/config/languages"
function Custom404() {
  const { language } = useSelector((state: RootStateStore) => state.options)

  return <h1 className="page404">{languages[language].ERROR_404}</h1>
}

export default Custom404
