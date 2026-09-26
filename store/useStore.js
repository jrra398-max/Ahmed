import{create}from"zustand";import{persist}from"zustand/middleware";
export const PRODUCTS=[
{id:"p1",name:"NOIR ESSENTIAL TEE",price:45,color:"Black",sizes:["XS","S","M","L","XL","XXL"],collection:"ESSENTIALS",drop:"DROP 01",description:"Heavyweight cotton tee with a minimal NOIR mark.",stock:24},
{id:"p2",name:"NOIR GRAPHIC TEE",price:50,color:"White",sizes:["S","M","L","XL"],collection:"DROP 01",drop:"DROP 01",description:"Premium cotton graphic tee.",stock:12},
{id:"p3",name:"NOIR ARCHIVE TEE",price:55,color:"Washed Black",sizes:["M","L","XL"],collection:"ARCHIVE",drop:"DROP 01",description:"Washed finish with archive print.",stock:8},
{id:"p4",name:"NOIR LIMITED TEE",price:70,color:"Charcoal",sizes:["S","M","L"],collection:"LIMITED",drop:"DROP 01",description:"Limited drop piece.",stock:5}
];
export const useStore=persist(create((set,get)=>({
bag:[],screen:"intro",selectedProduct:null,rackOpen:false,checkout:false,order:null,customer:{name:"",phone:"",address:"",city:"",notes:""},sound:true,
add:(p,size)=>set(s=>({bag:[...s.bag,{...p,size,qty:1,lineId:crypto.randomUUID()}]})),
remove:id=>set(s=>({bag:s.bag.filter(x=>x.lineId!==id)})),
clear:()=>set({bag:[]}),
setScreen:screen=>set({screen}),setSelectedProduct:p=>set({selectedProduct:p,rackOpen:!!p}),setRackOpen:v=>set({rackOpen:v}),
setCheckout:v=>set({checkout:v}),setCustomer:c=>set({customer:{...get().customer,...c}}),setOrder:o=>set({order:o}),toggleSound:()=>set(s=>({sound:!s.sound}))
}),{name:"noir-bag"}));
