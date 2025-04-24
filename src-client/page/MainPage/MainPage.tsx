import './MainPage.css'
import {Simulate} from "react-dom/test-utils";
import dragOver = Simulate.dragOver;

export function MainPage() {
    return (
        <div className="container">
            <h1>MainPage</h1>
            <div className="header">

            </div>
            <div className="main">
                <div className="main_left"></div>
                <div className="main_right"></div>
            </div>

        </div>

    )
}
