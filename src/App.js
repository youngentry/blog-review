import "./css/reset.css";
import "./css/App.scss";
import Button from "react-bootstrap/Button";
import { useState } from "react";

function App() {
    const [likes, setLikes] = useState(0);
    return (
        <div className="App">
            <Button className="likes" variant="outline-primary" onClick={() => setLikes(likes + 1)}>
                <strong>❤</strong>
                <span>{likes}</span>
            </Button>
        </div>
    );
}

export default App;
