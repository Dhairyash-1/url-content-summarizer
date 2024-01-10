import { FC } from "react"
interface LoaderProps {
  message: string
}
const Loader: FC<LoaderProps> = ({ message }) => {
  return (
    <>
      <span className="loader"></span>
      <span className="loader-msg">{message}</span>
    </>
  )
}
export default Loader
