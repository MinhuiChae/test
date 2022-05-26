import { THTMLElement } from '@/types';

export default () => {
 
  const getElementValue = <T extends THTMLElement>(element: T): string => {
    return element.value;
  }
  
  const setProperty = <T, K extends keyof T> (obj: T , key: K, value: T[K]) => {
    obj[key] = value;
  }

  return {
    setProperty,
    getElementValue,
  }
}
  
