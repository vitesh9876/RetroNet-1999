import { useState } from 'react';
import Window from './Window';
import { Calculator as CalculatorIcon } from 'lucide-react';
import { CommonWindowProps } from '../types';

const Calculator: React.FC<CommonWindowProps> = (props) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [memory, setMemory] = useState(0);
  const [lastResult, setLastResult] = useState<number | null>(null);

  const buttons = [
    '7', '8', '9', '/', 'sqrt',
    '4', '5', '6', '*', '%',
    '1', '2', '3', '-', '1/x',
    '0', '+/-', '.', '+', '='
  ];

  const handlePress = (btn: string) => {
    if (btn === '=') {
      try {
        // Simple eval-like calculation
        const result = eval(expression.replace(/[^-+/*0-9.]/g, ''));
        setDisplay(result.toString().slice(0, 10));
        setExpression(result.toString());
        setLastResult(result);
      } catch {
        setDisplay('Error');
        setExpression('');
      }
      return;
    }

    if (btn === 'sqrt') {
      const val = parseFloat(display);
      const res = Math.sqrt(val);
      setDisplay(res.toString().slice(0, 10));
      setExpression(res.toString());
      return;
    }

    if (btn === '1/x') {
      const val = parseFloat(display);
      const res = 1 / val;
      setDisplay(res.toString().slice(0, 10));
      setExpression(res.toString());
      return;
    }

    if (btn === '+/-') {
      const val = parseFloat(display);
      const res = val * -1;
      setDisplay(res.toString().slice(0, 10));
      setExpression(res.toString());
      return;
    }

    if (btn === '%') {
      const val = parseFloat(display);
      const res = val / 100;
      setDisplay(res.toString().slice(0, 10));
      setExpression(res.toString());
      return;
    }

    if (['+', '-', '*', '/'].includes(btn)) {
      setExpression(prev => prev + btn);
      return;
    }

    if (expression === '0' || (lastResult !== null && expression === lastResult.toString())) {
      setExpression(btn);
      setDisplay(btn);
      setLastResult(null);
    } else {
      setExpression(prev => prev + btn);
      setDisplay(prev => (prev === '0' || (lastResult !== null && prev === lastResult.toString())) ? btn : prev + btn);
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
    setLastResult(null);
  };

  return (
    <Window title="Calculator" icon={<CalculatorIcon size={14} />} width={260} height={320} {...props}>
      <div className="h-full bg-[#c0c0c0] p-2 font-sans text-xs flex flex-col gap-1">
        {/* Menu */}
        <div className="flex gap-4 px-1 py-0.5 border-b border-gray-400 text-[10px]">
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Edit</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">View</span>
          <span className="hover:bg-[#000080] hover:text-white px-1 cursor-pointer">Help</span>
        </div>

        <div className="p-2 flex flex-col gap-2">
          {/* Display */}
          <div className="win95-window shadow-inner bg-white min-h-10 p-1 text-right font-mono text-2xl overflow-hidden border-2 border-retro-border-dark flex items-center justify-end">
            {display}
          </div>

          <div className="flex gap-2">
            {/* Memory Buttons */}
            <div className="flex flex-col gap-1 w-8">
              <div className="h-6 border border-gray-500 bg-white mb-1 flex items-center justify-center font-bold text-[10px]">{memory !== 0 ? 'M' : ''}</div>
              <button className="win95-button h-6 text-[9px] text-red-700" onClick={() => setMemory(0)}>MC</button>
              <button className="win95-button h-6 text-[9px] text-red-700" onClick={() => setDisplay(memory.toString())}>MR</button>
              <button className="win95-button h-6 text-[9px] text-red-700" onClick={() => setMemory(parseFloat(display))}>MS</button>
              <button className="win95-button h-6 text-[9px] text-red-700" onClick={() => setMemory(prev => prev + parseFloat(display))}>M+</button>
            </div>

            {/* Keypad */}
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex gap-1 justify-end">
                <button className="win95-button h-6 px-4 text-red-700" onClick={() => setExpression(prev => prev.slice(0, -1))}>Back</button>
                <button className="win95-button h-6 px-4 text-red-700" onClick={() => { setDisplay('0'); setExpression(''); }}>CE</button>
                <button className="win95-button h-6 px-4 text-red-700" onClick={clear}>C</button>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {buttons.map((btn) => (
                  <button
                    key={btn}
                    className={`win95-button h-8 font-bold flex items-center justify-center ${['/', '*', '-', '+', '='].includes(btn) ? 'text-red-700' : 'text-blue-800'}`}
                    onClick={() => handlePress(btn)}
                  >
                    {btn === '*' ? '×' : btn === '/' ? '÷' : btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Window>
  );
};

export default Calculator;
