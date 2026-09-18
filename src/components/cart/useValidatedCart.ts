'use client';
import { useEffect, useState } from 'react';
import type { CartValidationResponse } from '@/lib/cart-validation';
import { useCart } from './CartProvider';

function isResponse(value:CartValidationResponse|{error?:string}):value is CartValidationResponse{return 'items' in value&&Array.isArray(value.items);}
export function useValidatedCart(){
 const cart=useCart();const [validation,setValidation]=useState<CartValidationResponse|null>(null);const [loading,setLoading]=useState(false);const [error,setError]=useState('');
 useEffect(()=>{if(!cart.hydrated||!cart.items.length)return;let canceled=false;
  async function run(){setLoading(true);setError('');try{const response=await fetch('/api/cart/validate',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart.items})});const payload=await response.json() as CartValidationResponse|{error?:string};if(!response.ok||!isResponse(payload))throw new Error();if(!canceled)setValidation(payload);}catch{if(!canceled){setValidation(null);setError('We could not check availability. Please refresh and try again.');}}finally{if(!canceled)setLoading(false);}}
  void run();return()=>{canceled=true;};
 },[cart.hydrated,cart.items]);
 const activeValidation=cart.items.length?validation:null;const activeLoading=cart.items.length?loading:false;const activeError=cart.items.length?error:'';
 return {...cart,validation:activeValidation,loading:activeLoading,error:activeError,hasBlockingIssue:Boolean(activeError||activeLoading||!activeValidation||activeValidation.hasBlockingIssue)};
}