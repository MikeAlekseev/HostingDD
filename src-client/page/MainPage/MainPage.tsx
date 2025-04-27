import '../../../MainPage.css'
import {Simulate} from "react-dom/test-utils";
import dragOver = Simulate.dragOver;

export function MainPage() {
    return (
        <div className="top div-bottom-borde">
            <h1>MainPage</h1>
            <div className="header">
                <div>
                    ТУТ КАКАЯ ТА НАДПИСЬ
                </div>
                <div className="login">
                    Login / Registration
                </div>
            </div>
            <div className="main r">
                <div className="main_left"></div>
                <div className="main_right">
                    <div className="main_button">
                        СЮДА ТАЩИТЬ ФАЙЛЫ
                    </div>
                </div>
            </div>

        </div>

    )
}
