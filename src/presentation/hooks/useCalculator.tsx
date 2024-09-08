import { useEffect, useRef, useState } from "react"

enum Operator {
    add = '+',
    subtract = '-',
    multiply = 'x',
    divide = '÷'
}

export const useCalculator = () => {

    const [formula, setformula] = useState('')

    const [number, setnumber] = useState('0')
    const [prevNumber, setprevNumber] = useState('0')

    const lastOperation = useRef<Operator>();

    useEffect(() => {
        if (lastOperation.current) {
            const firstFormulaPart = formula.split(' ').at(0);
            setformula(`${firstFormulaPart} ${lastOperation.current} ${number}`);
            
        } else {
            setformula(number);
        }

    }, [number]);

    useEffect(() => {
        const resultPrevNumber = calculateSubResult()
        setprevNumber(`${resultPrevNumber}`)
    }, [formula])
    


    //Limpiar calculadora
    const clean = () => {
        setnumber('0');
        setprevNumber('0');
        lastOperation.current = undefined;
        setformula('')
    }

    //Borrar el ultimo numero 
    const deleteOperation = () => {

        let currentSign = '';
        let temporalNumber = number;

        if (number.includes('-')) {
            currentSign = '-';
            temporalNumber = number.substring(1)
        }

        if (temporalNumber.length > 1) {
            return setnumber(currentSign + temporalNumber.slice(0, -1))
        }

        setnumber('0');
    }


    const toggleSign = () => {
        if (number.includes('-')) {
            return setnumber(number.replace('-', ''))
        }

        setnumber('-' + number);
    }

    const buildNumber = (numberString: string) => {

        if (number.includes('.') && numberString === '.') return;

        if (number.startsWith('0') || number.startsWith('-0')) {

            //Punto decimal
            if (numberString === '.') {
                return setnumber(number + numberString);
            }

            //Evaluar si es otro cero y no hay punto
            if (numberString === '0' && number.includes('.')) {
                return setnumber(number + numberString);
            }

            //Evaluar si es diferente de cero, no hay punto, y es el primer numero
            if (numberString !== '0' && !number.includes('.')) {
                return setnumber(numberString)
            }

            //Evitar 0000000
            if (numberString === '0' && !number.includes('.')) {
                return;
            }

            return setnumber(number + numberString)
        }

        setnumber(number + numberString)
    }

    const setLastNumber = () => {
        calculateResult();
        if (number.endsWith('.')) {
            setprevNumber(number.slice(0, -1))
        } else {
            setprevNumber(number);
        }
        setnumber('0')
    }

    //OPERATIONS
    const divideOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.divide;
    }

    const multiplyOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.multiply;
    }

    const subtractOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.subtract;
    }

    const addOperation = () => {
        setLastNumber();
        lastOperation.current = Operator.add;
    }

    const calculateResult = () => {
        const result = calculateSubResult();
        setformula(`${ result}`);

        lastOperation.current = undefined;
        //setprevNumber('0')
    }

    const calculateSubResult = (): number => {

        const [firstValue, operation, secondValue] = formula.split(' ');

        const num1 = Number(firstValue);
        const num2 = Number(secondValue);

        if(isNaN(num2)) return num1;

        switch (operation) {

            case Operator.add:
                return num1 + num2;

            case Operator.subtract:
                return num1 - num2;

            case Operator.multiply:
                return num1 * num2;

            case Operator.divide:
                return num1 / num2;
            default:
                throw new Error('Operation not implemented')
        }
    }

    return {
        //Properties
        number,
        prevNumber,
        formula,

        //Methods
        clean,
        deleteOperation,
        toggleSign,
        buildNumber,
        divideOperation,
        multiplyOperation,
        subtractOperation,
        addOperation,
        calculateResult,
    }
}
