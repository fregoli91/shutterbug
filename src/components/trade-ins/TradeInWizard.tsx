'use client';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

type FormState = {
  itemType: string; brand: string; model: string; modelUnknown: boolean; quantity: number;
  condition: string; powersOn: boolean | null; functionalNotes: string; cosmeticNotes: string;
  includedItems: string[]; additionalNotes: string; payoutPreference: string; phone: string;
  localHandoffRequested: boolean;
};
type Initial = Partial<FormState> & { id: string; reference: string; images: Array<{ id: string; url: string }> };
const empty: FormState = { itemType:'',brand:'',model:'',modelUnknown:false,quantity:1,condition:'',powersOn:null,functionalNotes:'',cosmeticNotes:'',includedItems:[],additionalNotes:'',payoutPreference:'',phone:'',localHandoffRequested:false };
const steps=['Gear','Condition','Included','Photos','Payout','Review'];
const inputClass='min-h-12 w-full rounded-lg border border-ink/20 bg-white px-4 text-ink outline-none focus:border-moss focus:ring-2 focus:ring-sage';
const items=['Battery','Charger','Lens cap','Body cap','Strap','Case or bag','Memory card','Manual','Original box','Cable'];
export function TradeInWizard({ initial }: { initial: Initial | null }) {
  const router=useRouter(); const [step,setStep]=useState(0); const [form,setForm]=useState<FormState>({...empty,...initial});
  const [id,setId]=useState(initial?.id||''); const [reference,setReference]=useState(initial?.reference||'');
  const [images,setImages]=useState(initial?.images||[]); const [status,setStatus]=useState(initial?'Draft loaded':'Not saved yet');
  const [error,setError]=useState(''); const [busy,setBusy]=useState(false); const [confirmed,setConfirmed]=useState(false); const hydrated=useRef(false);
  const update=<K extends keyof FormState>(key:K,value:FormState[K])=>setForm(current=>({...current,[key]:value}));

  const save=useCallback(async(submit=false)=>{
    setBusy(true); setError('');
    try {
      const response=await fetch(id?`/api/trade-ins/${id}`:'/api/trade-ins',{method:id?'PATCH':'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...form,submit,ownershipConfirmed:confirmed})});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error||'We could not save your trade-in.');
      if(!id){setId(data.tradeIn.id);setReference(data.tradeIn.reference);history.replaceState(null,'',`/account/trade-ins/new?draft=${data.tradeIn.id}`);}
      setStatus(submit?'Submitted':'Saved');
      if(submit) router.push(`/account/trade-ins/${data.tradeIn.id}`);
      return data.tradeIn.id as string;
    } catch(e){setError(e instanceof Error?e.message:'We could not save your trade-in.');return '';} finally{setBusy(false);}
  },[form,id,router,confirmed]);

  useEffect(()=>{if(!id){hydrated.current=true;return;} if(!hydrated.current){hydrated.current=true;return;} setStatus('Saving...');const timer=setTimeout(()=>void save(false),900);return()=>clearTimeout(timer);},[form,id,save]);

  async function next(){if(step===0&&!form.itemType){setError('Choose a gear type.');return;} if(step===0&&!form.brand.trim()){setError('Enter the brand.');return;} if(step===0&&!form.modelUnknown&&!form.model.trim()){setError('Enter the model or mark it unknown.');return;} setError('');if(!id){const created=await save(false);if(!created)return;}setStep(s=>Math.min(steps.length-1,s+1));}
  async function upload(files:FileList|null){if(!files?.length)return;setBusy(true);setError('');let tradeInId=id;if(!tradeInId)tradeInId=await save(false);if(!tradeInId){setBusy(false);return;}try{for(const file of Array.from(files)){const body=new FormData();body.append('file',file);const response=await fetch(`/api/trade-ins/${tradeInId}/images`,{method:'POST',body});const data=await response.json();if(!response.ok)throw new Error(data.error||'Photo upload failed.');setImages(current=>[...current,data.image]);}setStatus('Photos saved');}catch(e){setError(e instanceof Error?e.message:'Photo upload failed.');}finally{setBusy(false);}}
  async function removeImage(imageId:string){if(!id)return;setBusy(true);const response=await fetch(`/api/trade-ins/${id}/images/${imageId}`,{method:'DELETE'});if(response.ok)setImages(x=>x.filter(i=>i.id!==imageId));else setError((await response.json()).error||'Could not remove photo.');setBusy(false);}
  async function moveImage(index:number,direction:number){if(!id)return;const next=[...images];const target=index+direction;if(target<0||target>=next.length)return;[next[index],next[target]]=[next[target],next[index]];setImages(next);const response=await fetch(`/api/trade-ins/${id}/images`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({imageIds:next.map(image=>image.id)})});if(!response.ok)setError((await response.json()).error||'Could not reorder photos.');}
  function toggleIncluded(item:string){update('includedItems',form.includedItems.includes(item)?form.includedItems.filter(x=>x!==item):[...form.includedItems,item]);}

  return <div className="mt-8 overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white shadow-soft">
    <div className="border-b border-ink/10 bg-mint p-4 sm:p-6"><div className="flex items-center justify-between gap-3"><p className="text-sm font-semibold text-forest">{reference||'New trade-in'} · {status}</p><p className="text-sm text-ink/60">Step {step+1} of {steps.length}</p></div>
      <ol className="mt-4 grid grid-cols-6 gap-1" aria-label="Trade-in progress">{steps.map((label,i)=><li key={label}><button type="button" onClick={()=>i<=step&&setStep(i)} className="w-full"><span className={`block h-2 rounded-full ${i<=step?'bg-forest':'bg-white'}`}/><span className="mt-2 hidden text-xs font-semibold text-ink/65 sm:block">{label}</span></button></li>)}</ol>
    </div>
    <div className="p-5 sm:p-8">
      {error?<p role="alert" className="mb-5 rounded-lg bg-sand p-4 text-sm font-semibold text-ink">{error}</p>:null}
      {step===0?<Panel title="What are you selling?" copy="Use the closest category. If you cannot find the model, a label photo can help us identify it.">
        <div className="grid gap-4 sm:grid-cols-2"><Field label="Gear type"><select className={inputClass} value={form.itemType} onChange={e=>update('itemType',e.target.value)}><option value="">Choose one</option><option value="DIGITAL_CAMERA">Digital camera</option><option value="FILM_CAMERA">Film camera</option><option value="LENS">Lens</option><option value="ACCESSORY">Accessory</option><option value="COLLECTION">Collection</option><option value="OTHER">Other gear</option></select></Field>
        <Field label="Brand"><input className={inputClass} value={form.brand} onChange={e=>update('brand',e.target.value)} placeholder="Canon, Nikon, Olympus..."/></Field>
        <Field label="Model"><input className={inputClass} value={form.model} disabled={form.modelUnknown} onChange={e=>update('model',e.target.value)} placeholder="PowerShot SD1000"/></Field>
        <Field label="Quantity"><input className={inputClass} type="number" min={1} max={50} value={form.quantity} onChange={e=>update('quantity',Number(e.target.value))}/></Field></div>
        <label className="mt-4 flex items-center gap-3 text-sm font-semibold text-ink"><input type="checkbox" checked={form.modelUnknown} onChange={e=>update('modelUnknown',e.target.checked)} className="h-5 w-5 accent-[#24543a]"/>I do not know the model</label>
      </Panel>:null}
      {step===1?<Panel title="Describe the condition" copy="A candid description helps us give you a more reliable preliminary offer.">
        <Field label="Overall condition"><select className={inputClass} value={form.condition} onChange={e=>update('condition',e.target.value)}><option value="">Choose one</option>{[['LIKE_NEW','Like new'],['EXCELLENT','Excellent'],['GOOD','Good'],['FAIR','Fair'],['POOR','Poor'],['FOR_PARTS','For parts or repair'],['UNKNOWN','Not sure']].map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></Field>
        <div className="mt-5"><p className="text-sm font-semibold text-ink">Does it power on?</p><div className="mt-2 flex gap-2">{[[true,'Yes'],[false,'No'],[null,'Not tested']].map(([v,l])=><button key={l as string} type="button" onClick={()=>update('powersOn',v as boolean|null)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${form.powersOn===v?'border-forest bg-forest text-white':'border-ink/15 bg-white text-ink'}`}>{l as string}</button>)}</div></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Functional notes"><textarea className={inputClass+' min-h-32 py-3'} value={form.functionalNotes} onChange={e=>update('functionalNotes',e.target.value)} placeholder="Flash, zoom, buttons, shutter, errors..."/></Field><Field label="Cosmetic notes"><textarea className={inputClass+' min-h-32 py-3'} value={form.cosmeticNotes} onChange={e=>update('cosmeticNotes',e.target.value)} placeholder="Scratches, dents, corrosion, haze..."/></Field></div>
      </Panel>:null}
      {step===2?<Panel title="What is included?" copy="Select everything that will be sent with the gear.">
        <div className="grid gap-3 sm:grid-cols-2">{items.map(item=><label key={item} className="flex min-h-12 items-center gap-3 rounded-lg border border-ink/10 px-4"><input type="checkbox" checked={form.includedItems.includes(item)} onChange={()=>toggleIncluded(item)} className="h-5 w-5 accent-[#24543a]"/><span className="font-semibold text-ink">{item}</span></label>)}</div>
        <div className="mt-5"><Field label="Anything else?"><textarea className={inputClass+' min-h-28 py-3'} value={form.additionalNotes} onChange={e=>update('additionalNotes',e.target.value)} placeholder="Extra lenses, duplicate items, history, or anything we should know."/></Field></div>
      </Panel>:null}
      {step===3?<Panel title="Add clear photos" copy="At least two photos are required. Include front, back, label or serial number, flaws, and accessories.">
        <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-moss/40 bg-mint p-6 text-center"><span className="font-bold text-forest">Choose photos</span><span className="mt-1 text-xs text-ink/60">JPG, PNG, or WebP · 8 MB each · up to 10</span><input className="sr-only" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy||images.length>=10} onChange={e=>void upload(e.target.files)}/></label>
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">{images.map((image,index)=><div key={image.id} className="relative overflow-hidden rounded-lg border border-ink/10 bg-cream"><Image src={image.url} alt={`Trade-in photo ${index+1}`} width={400} height={300} unoptimized className="aspect-[4/3] w-full object-cover"/><div className="absolute inset-x-2 top-2 flex justify-between gap-2"><div className="flex gap-1"><button type="button" aria-label="Move photo earlier" disabled={index===0} onClick={()=>void moveImage(index,-1)} className="rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-ink disabled:opacity-40">←</button><button type="button" aria-label="Move photo later" disabled={index===images.length-1} onClick={()=>void moveImage(index,1)} className="rounded-full bg-white/90 px-2 py-1 text-xs font-bold text-ink disabled:opacity-40">→</button></div><button type="button" onClick={()=>void removeImage(image.id)} className="rounded-full bg-ink/85 px-3 py-1 text-xs font-bold text-white">Remove</button></div></div>)}</div>
      </Panel>:null}
      {step===4?<Panel title="Choose your preferred payout" copy="You can compare both values when an offer arrives. This preference helps us tailor the review.">
        <div className="grid gap-4 sm:grid-cols-2"><Choice active={form.payoutPreference==='CASH'} title="Cash" copy="Receive the confirmed cash amount after inspection." onClick={()=>update('payoutPreference','CASH')}/><Choice active={form.payoutPreference==='STORE_CREDIT'} title="Store credit" copy="Usually offers more value for a future Shutterbug purchase." onClick={()=>update('payoutPreference','STORE_CREDIT')}/></div>
        <div className="mt-5 grid gap-4 sm:grid-cols-2"><Field label="Phone (optional)"><input className={inputClass} value={form.phone} onChange={e=>update('phone',e.target.value)} autoComplete="tel"/></Field><label className="flex items-center gap-3 rounded-lg border border-ink/10 p-4 text-sm"><input type="checkbox" checked={form.localHandoffRequested} onChange={e=>update('localHandoffRequested',e.target.checked)} className="h-5 w-5 accent-[#24543a]"/><span><strong className="block text-ink">Ask about local handoff</strong><span className="text-ink/60">Available only when Shutterbug confirms arrangements.</span></span></label></div>
      </Panel>:null}
      {step===5?<Panel title="Review and submit" copy="Your preliminary offer is based on these details. The final value is confirmed after inspection.">
        <div className="grid gap-3 rounded-lg bg-cream p-5 text-sm sm:grid-cols-2"><Review label="Gear" value={`${form.brand} ${form.modelUnknown?'Unknown model':form.model}`}/><Review label="Quantity" value={String(form.quantity)}/><Review label="Condition" value={form.condition.replaceAll('_',' ')||'Not chosen'}/><Review label="Photos" value={String(images.length)}/><Review label="Payout preference" value={form.payoutPreference.replaceAll('_',' ')||'Not chosen'}/><Review label="Included" value={form.includedItems.join(', ')||'Nothing listed'}/></div>
        <label className="mt-5 flex items-start gap-3 text-sm leading-6 text-ink/70"><input required type="checkbox" checked={confirmed} onChange={e=>setConfirmed(e.target.checked)} className="mt-1 h-5 w-5 accent-[#24543a]"/><span>I confirm that I own this gear or am authorized to sell it, and that the details are accurate to the best of my knowledge.</span></label>
      </Panel>:null}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3"><button type="button" disabled={step===0||busy} onClick={()=>setStep(s=>Math.max(0,s-1))} className="min-h-11 rounded-full border border-ink/15 px-5 font-semibold disabled:opacity-40">Back</button><div className="flex gap-2"><button type="button" disabled={busy} onClick={()=>void save(false)} className="min-h-11 rounded-full border border-forest px-5 font-semibold text-forest disabled:opacity-50">{busy?'Saving...':'Save draft'}</button>{step<steps.length-1?<button type="button" disabled={busy} onClick={()=>void next()} className="min-h-11 rounded-full bg-forest px-6 font-semibold text-white disabled:opacity-50">Continue</button>:<button type="button" disabled={busy} onClick={()=>{if(!confirmed){setError('Confirm that you own or are authorized to sell this gear.');return;}void save(true);}} className="min-h-11 rounded-full bg-forest px-6 font-semibold text-white disabled:opacity-50">Submit for review</button>}</div></div>
    </div>
  </div>;
}
function Panel({title,copy,children}:{title:string;copy:string;children:React.ReactNode}){return <section><h2 className="font-serif text-3xl font-bold text-ink">{title}</h2><p className="mt-2 mb-6 text-sm leading-6 text-ink/65">{copy}</p>{children}</section>}
function Field({label,children}:{label:string;children:React.ReactNode}){return <label className="block"><span className="mb-2 block text-sm font-semibold text-ink">{label}</span>{children}</label>}
function Choice({active,title,copy,onClick}:{active:boolean;title:string;copy:string;onClick:()=>void}){return <button type="button" onClick={onClick} className={`rounded-lg border p-5 text-left ${active?'border-forest bg-mint ring-2 ring-sage':'border-ink/10 bg-white'}`}><span className="font-serif text-2xl font-bold text-ink">{title}</span><span className="mt-2 block text-sm leading-6 text-ink/65">{copy}</span></button>}
function Review({label,value}:{label:string;value:string}){return <div><p className="text-xs font-bold uppercase tracking-[.14em] text-moss">{label}</p><p className="mt-1 font-semibold capitalize text-ink">{value}</p></div>}