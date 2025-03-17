import "./Buttons-style.css"
interface ButtonProps {
    buttonText: String,
    buttonFunc?: () => void,
}
export default function Button({buttonText, buttonFunc} : ButtonProps){
    return(
        <>
            <div className="button-container" onClick={buttonFunc}>
                <p>{buttonText}</p>
            </div>
        </>
    )
}