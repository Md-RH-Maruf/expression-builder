import Tippy from '@tippyjs/react';
import React, { useRef, useState } from "react";
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { useImmer } from "use-immer";
import back from '../../assets/images/back.svg';
import KeyBoard from "../key-board/KeyBoardEmmer";
import './expression-field.css';

const ExpressionField = () => {

    const fieldList = ['User Name', 'First Name', 'Last Name', 'Price', 'Quantity'];
    const keyList = [{ type: 'back', content: <img src={back} alt='' /> },
    { id:6,type: 'operator', content: '(' },
    { id:7,type: 'operator', content: ')' },
    { id:8,type: 'empty', content: '' },
    { id:9,type: 'number', content: '7' },
    { id:10,type: 'number', content: '8' },
    { id:11, type: 'number', content: '9' },
    { id:12,type: 'operator', content: '/' },
    { id:13,type: 'number', content: '4' },
    { id:14,type: 'number', content: '5' },
    { id:15,type: 'number', content: '6' },
    { id:16,type: 'operator', content: '*' },
    { id:17,type: 'number', content: '1' },
    { id:18,type: 'number', content: '2' },
    { id:19,type: 'number', content: '3' },
    { id:20,type: 'operator', content: '+' },
    { id:21,type: 'number', content: '0' },
    { id:22,type: 'number', content: '.' },
    { id:23,type: 'operator', content: '-' }];

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
                
                const newCaretPos = caretPosition - 1;
                setCaretPosition(oldPosition => oldPosition = newCaretPos);
                setExpressions(oldExp =>{
                    
                    [oldExp[newCaretPos], oldExp[newCaretPos + 1]] = [oldExp[newCaretPos + 1], oldExp[newCaretPos]];
                });
            } else if (key === 'ArrowRight' && caretPosition < expressions.length - 1) {
               
                const newCaretPos = caretPosition + 1;
                
                setCaretPosition(oldPosition => oldPosition =newCaretPos);
                setExpressions(oldExp =>{
                    [oldExp[newCaretPos - 1], oldExp[newCaretPos]] = [oldExp[newCaretPos], oldExp[newCaretPos - 1]];
                });
            }

            if (key === 'Backspace') {
                if (caretPosition > 0) {
                    setExpressions(oldState => oldState = oldState.slice(0, caretPosition - 1).concat(oldState.slice(caretPosition)));
                    setCaretPosition(oldPosition => oldPosition = oldPosition- 1);
                }
            } else if ((!isNaN(key)) || key === '.') {
                setExpressions(oldState => {
                    oldState.splice(caretPosition, 0, { type: 'number', content: key });
                });
                setCaretPosition(oldPosition => oldPosition = oldPosition + 1);
            } else if (['+', '-', '*', '/', '(', ')'].indexOf(key) !== -1) {
                setExpressions(oldState => {
                    oldState.splice(caretPosition, 0, { type: 'operator', content: key });
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
                    }else{
                        console.log(' ----- straight-----');
                        if(expFieldChild[i+1]){
                            const rectNext = expFieldChild[i+1].getBoundingClientRect();
                            if(rectNext.y > rect.y+rect.height) {
                                moveCaret(i+1, 'straight');
                                break;
                            }
                        }
                        
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
            setExpressions(oldState => [...oldState, { id:0,type: 'caret', content: '' }]);
            setIsExpFocused(true);
        }
    }

    function moveCaret(newPosition, side = 'before') {
        if (side === 'straight') {
            if (caretPosition !== newPosition) {
                
                const temp = [...expressions];
                if(newPosition === temp.length){
                    temp.splice(caretPosition, 1);
                    newPosition = temp.length;
                }else if(caretPosition < newPosition){
                    newPosition--;
                    temp.splice(caretPosition, 1);
                }else{
                    temp.splice(caretPosition, 1);
                }
                temp.splice(newPosition, 0, {id:0,type: 'caret', content: '' });
                setExpressions(oldExpression => oldExpression = temp);
                setCaretPosition(oldPosition => oldPosition = newPosition);
               
            }
        } else if (side === 'before' && caretPosition !== newPosition - 1) {
            
            if(caretPosition < newPosition) newPosition--;
            setExpressions(oldExpression =>{
                oldExpression.splice(caretPosition,1);
                oldExpression.splice(newPosition, 0, {id:0,type: 'caret', content: '' });
                console.log(side,newPosition,caretPosition,oldExpression);
            });
            setCaretPosition(oldPosition => oldPosition = newPosition);
        } else if (side === 'after' && caretPosition !== newPosition + 1) {
            newPosition++;
            if(caretPosition < newPosition) --newPosition;
            setExpressions(oldExpression =>{
                oldExpression.splice(caretPosition,1);
                oldExpression.splice(newPosition, 0, {id:0,type: 'caret', content: '' });
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
