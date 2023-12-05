const Notification = (props) => {
    if (props.message === null) {
        return null
    }

    return (
        <div className={`notification ${props.isError ? " error" : "success"}`}>
            {props.message}
        </div>
    )
}

export default Notification