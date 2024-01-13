import { FC } from "react"
import ErrorIcon from "../assets/errorIcon.png"

interface messageProp {
  message: string
}

const ErrorMsg: FC<messageProp> = ({ message }) => {
  return (
    <div className="error">
      <img src={ErrorIcon} alt="error" />
      {message}
    </div>
  )
}
export default ErrorMsg
