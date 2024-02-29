import "./NotFound.scss"
import { useSelector } from "react-redux"
import { RootState } from "@/store/store"
import { variables } from "@/variables"
function Custom404() {
  const { language } = useSelector((state: RootState) => state.options)

  return <h1 className="page404">{variables.LANGUAGES[language].ERROR_404}</h1>
}

export default Custom404
