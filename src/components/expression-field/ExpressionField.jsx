import React, { useEffect, useRef, useState } from "react";
import './expression-field.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import KeyBoard from "../key-board/KeyBoard";
import 'tippy.js/themes/light.css';
import back from '../../assets/images/back.svg';
const ExpressionField = () => {

    const fieldList = ['User Name', 'First Name', 'Last Name', 'Price', 'Quantity'];
    const keyList = [{ type: 'back', content: <img src={back} alt='' /> },
    { type: 'operator', content: '(' },
    { type: 'operator', content: ')' },
    { type: 'empty', content: '' },
    { type: 'number', content: '7' },
    { type: 'number', content: '8' },
    { type: 'number', content: '9' },
    { type: 'operator', content: '/' },
    { type: 'number', content: '4' },
    { type: 'number', content: '5' },
    { type: 'number', content: '6' },
    { type: 'operator', content: '*' },
    { type: 'number', content: '1' },
    { type: 'number', content: '2' },
    { type: 'number', content: '3' },
    { type: 'operator', content: '+' },
    { type: 'number', content: '0' },
    { type: 'number', content: '.' },
    { type: 'operator', content: '-' }];

    const [expressions, setExpressions] = useState([]);
    const [isExpFocused, setIsExpFocused] = useState(false);
    const [caretPosition, setCaretPosition] = useState(0);


    const expRef = useRef(null);

    useEffect(() => {
        // console.log(expressionBuilder(expressions));
    }, [expressions]);


    const expressionBuilder = (expressions) => {
        let expString = ""
        expressions.forEach((expItem) => {
            if (expItem.type === 'field') {
                expString += `\${${expItem.content}}`
            } else {
                expString += expItem.content;
            }
        });
        return expString;
    }

    const keyPressAction = (event) => {
        const key = event.key;
        event.preventDefault()
        if (isExpFocused) {
            if (key === 'ArrowLeft' && caretPosition > 0) {
                const tempExp = [...expressions];
                const newCaretPos = caretPosition - 1;
                [tempExp[newCaretPos], tempExp[newCaretPos + 1]] = [tempExp[newCaretPos + 1], tempExp[newCaretPos]];
                setCaretPosition(newCaretPos);
                setExpressions(tempExp);
            } else if (key === 'ArrowRight' && caretPosition < expressions.length - 1) {
                const tempExp = [...expressions];
                const newCaretPos = caretPosition + 1;
                [tempExp[newCaretPos - 1], tempExp[newCaretPos]] = [tempExp[newCaretPos], tempExp[newCaretPos - 1]];
                setCaretPosition(newCaretPos);
                setExpressions(tempExp);
            }

            if (key === 'Backspace') {
                if (caretPosition > 0) {
                    setExpressions(oldState => [...oldState.slice(0, caretPosition - 1), ...oldState.slice(caretPosition)])
                    setCaretPosition(prevPosition => prevPosition - 1);
                }
            } else if ((!isNaN(key)) || key === '.') {
                setExpressions(oldState => {
                    const tempExp = [...oldState];
                    tempExp.splice(caretPosition, 0, { type: 'number', content: key });
                    return tempExp
                });
                setCaretPosition(prevPosition => prevPosition + 1);
            } else if (['+', '-', '*', '/', '(', ')'].indexOf(key) !== -1) {
                setExpressions(oldState => {
                    const tmpExp = [...oldState]
                    tmpExp.splice(caretPosition, 0, { type: 'operator', content: key });
                    return tmpExp;
                });
                setCaretPosition(prevPosition => prevPosition + 1);
            }
        }
    }

    const expressionFieldClickAction = (e) => {
        //console.log(e);
        const clickX = e.pageX;
        const clickY = e.pageY;
        if (e.target.className === 'expression-field') {
            const expField = e.target;
            //const rect = expField.getBoundingClientRect();
            const expFieldChild = expField.children;

            if (expField.children.length > 1) {
                let i = 0;
                for (i = 0; i < expFieldChild.length; i++) {
                    const rect = expFieldChild[i].getBoundingClientRect();
                    if (clickX < (rect.x)) {
                        moveCaret2(i, 'straight');
                        break;
                    }
                }
                if (i === expFieldChild.length) {
                    moveCaret2(i - 1, 'straight');
                }

            }

        } else {
            const target = e.target;
            const expFieldChild = target.parentElement.children;

            for (let i = 0; i < expFieldChild.length; i++) {
                if (expFieldChild[i] === target) {
                    const rect = target.getBoundingClientRect();
                    const mid = (rect.width / 2);
                    if (clickX > (mid + rect.x)) {
                        moveCaret(i, 'after');
                    } else {
                        moveCaret(i);
                    }
                }
            }
            // for(let i=0;i<expField.children.length;i++){

            // }
        }
        if (!isExpFocused) {
            setExpressions(oldState => [...oldState, { type: 'caret', content: '' }]);
            setIsExpFocused(true);
        }
    }

    function moveCaret(newPosition, isBefore = 'before') {

        if (isBefore === 'after' && caretPosition > newPosition) newPosition++;
        console.log("caret-position=", caretPosition, " new-position=", newPosition)

        if (newPosition !== caretPosition && caretPosition !== newPosition) {
            setExpressions(oldState => {
                const tempExp = [...oldState];

                tempExp.splice(caretPosition, 1);
                if (tempExp.length < newPosition) newPosition = tempExp.length;
                tempExp.splice(newPosition, 0, { type: 'caret', content: '' });
                return tempExp;
            });
            setCaretPosition(oldState => newPosition);
        } else if (caretPosition < newPosition && isBefore === 'before' && caretPosition !== newPosition - 1) {
            setExpressions(oldState => {
                const tempExp = [...oldState];
                tempExp.splice(caretPosition, 1);
                --newPosition;
                if (tempExp.length < newPosition) newPosition = tempExp.length;
                console.log("splice caret-position=", caretPosition, " new-position=", newPosition)
                tempExp.splice(newPosition, 0, { type: 'caret', content: '' });
                return tempExp;
            });
            setCaretPosition(oldState => newPosition);
        } else if (isBefore === 'straight') {
            setExpressions(oldState => {
                const tempExp = [...oldState];

                tempExp.splice(caretPosition, 1);
                if (tempExp.length < newPosition) newPosition = tempExp.length;
                console.log("splice caret-position=", caretPosition, " new-position=", newPosition)
                tempExp.splice(newPosition, 0, { type: 'caret', content: '' });
                return tempExp;
            });
            setCaretPosition(oldState => newPosition);
        }
    }

    function moveCaret2(newPosition, side = 'before') {
        if (side === 'straight') {
            if (caretPosition !== newPosition) {
                setExpressions(oldState => {
                    const tempExp = [...oldState];
    
                    tempExp.splice(caretPosition, 1);
                    if (tempExp.length < newPosition) newPosition = tempExp.length;
                    console.log("splice caret-position=", caretPosition, " new-position=", newPosition)
                    tempExp.splice(newPosition, 0, { type: 'caret', content: '' });
                    return tempExp;
                });
                setCaretPosition(oldState => newPosition);
               
            }



        } else if (side === 'before' && caretPosition !== newPosition - 1) {

        } else if (side === 'after' && caretPosition !== newPosition + 1) {

        }
    }
    return (<Tippy
        // options
        trigger='click'
        theme='light'
        maxWidth='520px'
        onShow={() => {
            expRef.current.focus();
        }}
        onHidden={() => {

        }}
        padding='5px'
        distance='400'
        interactive={true}
        content={<KeyBoard setExpressions={setExpressions} expRef={expRef} caretPosition={caretPosition} setCaretPosition={setCaretPosition} fieldList={fieldList} keyList={keyList} />}>
        <div className='container'>
            <div className='expression-field' ref={expRef} onClick={expressionFieldClickAction} onKeyDown={keyPressAction} tabIndex={0}>
                {
                    expressions.map((expElemnet, index) => <span key={`exp-${index}`} className={expElemnet.type}>{expElemnet.content}</span>)
                }
            </div>

        </div>
    </Tippy >);
}


export default ExpressionField;
