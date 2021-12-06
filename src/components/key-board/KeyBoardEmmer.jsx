import React from 'react';
import './key-board.css'
import cross from '../../assets/images/cross.png';
import { hideAll } from 'tippy.js';

function KeyBoard({ caretPosition, setCaretPosition, expRef, fieldList, keyList, setExpressions}) {

    const clickAction = (type, content) => {
        if (type === 'back') {
            if (caretPosition > 0) {
                setExpressions(oldExpression => oldExpression = oldExpression.slice(0, caretPosition - 1).concat(oldExpression.slice(caretPosition)));
                setCaretPosition(oldPosition => oldPosition = oldPosition - 1);
            }
            //setExpressions(oldState => [...oldState.slice(0, -1)])
        } else {
            setExpressions(oldExpression => oldExpression = oldExpression.slice(0, caretPosition).concat([{ type, content }], oldExpression.slice(caretPosition)));
            //setMaxNum(prevNum => prevNum+1);
            setCaretPosition(oldPosition => oldPosition = oldPosition + 1);
        }
        expRef.current.focus();

    }



    return (
        <div className="board">
            <div className="left-slider">
                <h4>Form Fields</h4>
                {fieldList.map((item, index) => <div className="field" key={`field-${index}`} onClick={() => clickAction("field", item)}>{item}</div>)}
            </div>
            <div className="key-container">
                {keyList.map((keyItem, index) => <div className={`custom-button ${keyItem.type}`} key={`button-${index}`} onClick={() => clickAction(keyItem.type, keyItem.content)}>
                    {keyItem.content}
                </div>
                )}
                <div className="cross-button" onClick={() => hideAll()}>
                    <img src={cross} alt="" />
                </div>
            </div>

        </div>
    );
}

export default KeyBoard;