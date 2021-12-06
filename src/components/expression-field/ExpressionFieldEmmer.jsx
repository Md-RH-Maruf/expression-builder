import React, { useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import './expression-field.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import KeyBoard from "../key-board/KeyBoardEmmer";
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

    const [expressions, setExpressions] = useImmer([]);
    const [isExpFocused, setIsExpFocused] = useState(false);
    const [caretPosition, setCaretPosition] = useImmer(0);

    const expRef = useRef(null);

    // useEffect(() => {
    //     console.log('expressions=',expressions);
    //     // console.log(expressionBuilder(expressions));
    // }, [expressions]);
 
    


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
                //const tempExp = [...expressions];
                const newCaretPos = caretPosition - 1;
                setCaretPosition(oldPosition => oldPosition = newCaretPos);
                setExpressions(oldExp =>{
                    //const tempExp = oldExp;
                    [oldExp[newCaretPos], oldExp[newCaretPos + 1]] = [oldExp[newCaretPos + 1], oldExp[newCaretPos]];
                });
            } else if (key === 'ArrowRight' && caretPosition < expressions.length - 1) {
                //const tempExp = [...expressions];
                const newCaretPos = caretPosition + 1;
                
                setCaretPosition(oldPosition => oldPosition =newCaretPos);
                setExpressions(oldExp =>{
                    [oldExp[newCaretPos - 1], oldExp[newCaretPos]] = [oldExp[newCaretPos], oldExp[newCaretPos - 1]];
                });
            }

            if (key === 'Backspace') {
                if (caretPosition > 0) {
                    //setExpressions(oldState => [...oldState.slice(0, caretPosition - 1), ...oldState.slice(caretPosition)])
                    setExpressions(oldState => oldState = oldState.slice(0, caretPosition - 1).concat(oldState.slice(caretPosition)));
                    setCaretPosition(oldPosition => oldPosition = oldPosition- 1);
                }
            } else if ((!isNaN(key)) || key === '.') {
                setExpressions(oldState => {
                    //const tempExp = [...oldState];
                    oldState.splice(caretPosition, 0, { type: 'number', content: key });
                    //return oldState;
                });
                setCaretPosition(oldPosition => oldPosition = oldPosition + 1);
            } else if (['+', '-', '*', '/', '(', ')'].indexOf(key) !== -1) {
                setExpressions(oldState => {
                    //const tmpExp = [...oldState]
                    oldState.splice(caretPosition, 0, { type: 'operator', content: key });
                    //return oldState;
                });
                setCaretPosition(oldPosition => oldPosition = oldPosition + 1);
            }
        }
    }

    const expressionFieldClickAction = (e) => {
        const clickX = e.pageX;
        const clickY = e.pageY;
        if (e.target.className === 'expression-field') {
            const expField = e.target;
            const expFieldChild = expField.children;

            if (expField.children.length > 1) {
                let i = 0;
                for (i = 0; i < expFieldChild.length; i++) {
                    const rect = expFieldChild[i].getBoundingClientRect();
                    
                    if(clickY > rect.y+rect.height) continue;

                    if (clickX < (rect.x)) {
                        moveCaret(i, 'straight');
                        break;
                    }
                }
                if (i === expFieldChild.length) {
                    moveCaret(i, 'straight');
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
                        break;
                    } else {
                        moveCaret(i, 'before');
                        break;
                    }
                }
            }
        }
        if (!isExpFocused) {
            setExpressions(oldState => [...oldState, { type: 'caret', content: '' }]);
            setIsExpFocused(true);
        }
    }

    function moveCaret(newPosition, side = 'before') {
        if (side === 'straight') {
            if (caretPosition !== newPosition) {
                

                setExpressions(oldExpression =>{
                    console.log('1st ',side,newPosition,caretPosition);
                    if(newPosition === oldExpression.length){
                        oldExpression.splice(caretPosition, 1);
                        newPosition = oldExpression.length;
                    }else if(caretPosition < newPosition){
                        newPosition--;
                        oldExpression.splice(caretPosition, 1);
                    }else{
                        oldExpression.splice(caretPosition, 1);
                    }

                    oldExpression.splice(newPosition, 0, {type: 'caret', content: '' });
                    console.log('2nd ',side,newPosition,caretPosition);
                })
                setCaretPosition(oldPosition => oldPosition = newPosition);
               
            }
        } else if (side === 'before' && caretPosition !== newPosition - 1) {
            //const tmp = [...expressions]
            //tmp.splice(caretPosition,1);
            //if(caretPosition < newPosition) newPosition--;
            ///console.log(side,newPosition,caretPosition);
            //tmp.splice(newPosition, 0, {type: 'caret', content: '' });
            //console.log('before tmp ', tmp)
            if(caretPosition < newPosition) newPosition--;
            setExpressions(oldExpression =>{
                oldExpression.splice(caretPosition,1);
                oldExpression.splice(newPosition, 0, {type: 'caret', content: '' });
                console.log(side,newPosition,caretPosition,oldExpression);
            });
            setCaretPosition(oldPosition => oldPosition = newPosition);
        } else if (side === 'after' && caretPosition !== newPosition + 1) {
            newPosition++;
            //const tempExp = [...expressions];
            //tempExp.splice(caretPosition,1);
            if(caretPosition < newPosition) --newPosition;
            //tempExp.splice(newPosition, 0, {type: 'caret', content: '' });
            //console.log(side,newPosition,caretPosition);
            //console.log('modified array=',tempExp);
            setExpressions(oldExpression =>{
                oldExpression.splice(caretPosition,1);
                oldExpression.splice(newPosition, 0, {type: 'caret', content: '' });
                console.log(side,newPosition,caretPosition,oldExpression);
            });
            setCaretPosition(oldPosition => oldPosition = newPosition);
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
        content={<KeyBoard setExpressions={setExpressions} expRef={expRef} caretPosition={caretPosition} setCaretPosition={setCaretPosition}   fieldList={fieldList} keyList={keyList} />}>
        <div className='container'>
            <div className='expression-field' ref={expRef} onClick={expressionFieldClickAction} onKeyDown={keyPressAction} tabIndex={0}>
                {
                    expressions.map((expElemnet, index) => <span key={index} className={expElemnet.type}>{expElemnet.content}</span>)
                }
            </div>

        </div>
    </Tippy >);
}


export default ExpressionField;
