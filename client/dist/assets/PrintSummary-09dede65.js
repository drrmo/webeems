import{bh as y,j as E,r as a,aK as S,b as s}from"./index-a50eb7ee.js";const P="/assets/print_header-cf530251.png";async function p({params:e}){window.document.title="Print Summary | WebEEMS";let n;try{n=await y(e.evacId)}catch{}return E(n)}const w=e=>{const n=new Date(e),c={year:"numeric",month:"short",day:"numeric"};return new Intl.DateTimeFormat("en-PH",c).format(n)};function H(){var o,h,m,x,j,u,N;const[e,n]=a.useState(),[c,b]=a.useState(),[r,g]=a.useState(null),l=S();return a.useEffect(()=>{l!=null&&l.data&&(n(l.data),b(l.user))},[]),a.useEffect(()=>{r&&e&&(e!=null&&e.ID)&&(r.onload=()=>window.print())},[r,e]),s.jsxs("div",{className:"print-container",children:[s.jsx("div",{className:"print-content-header",children:s.jsx("img",{src:P,alt:"Header MDRRMO",ref:g,className:"w-100"})}),s.jsxs("div",{className:"print-content-body",children:[s.jsx("div",{className:"right",children:s.jsxs("div",{children:["Date: ",w(new Date)]})}),s.jsx("div",{className:"center",children:s.jsx("h4",{className:"fw-bold",children:"Evacuation Report"})}),s.jsx("div",{children:s.jsxs("h6",{children:[s.jsx("span",{className:"fw-bold",children:"Evacuation Center:"})," ",s.jsx("span",{className:"text-decoration-underline",children:e==null?void 0:e.BuildingName})]})}),s.jsx("div",{children:s.jsxs("h6",{children:[s.jsx("span",{className:"fw-bold",children:"Address:"})," ",s.jsxs("span",{className:"text-decoration-underline",children:[e==null?void 0:e.StreetNum," ",e==null?void 0:e.District," ",e==null?void 0:e.Barangay,", ",e==null?void 0:e.Municipality,", ",e==null?void 0:e.Province,", ",e==null?void 0:e.Region,", ",e==null?void 0:e.ZipCode]})]})}),s.jsx("div",{children:" "}),s.jsx("div",{children:s.jsxs("table",{className:"table table-bordered",children:[s.jsx("thead",{children:s.jsxs("tr",{children:[s.jsx("th",{children:"Household ID"}),s.jsx("th",{children:"Household Head Member"}),s.jsx("th",{children:"Household Members"}),s.jsx("th",{children:"Members Evacuated"}),s.jsx("th",{colSpan:2,children:"Household Evacuation Details"})]})}),s.jsx("tbody",{children:(h=(o=e==null?void 0:e.PreEvacuation)==null?void 0:o.Evacuated)==null?void 0:h.map(d=>[...d.ID.Household.Members,d.ID.Household.Head].map((t,v,i)=>{var f;return s.jsxs("tr",{children:[v===0&&s.jsxs(s.Fragment,{children:[s.jsx("td",{rowSpan:i.length,children:(f=d.ID)==null?void 0:f.HouseID}),s.jsx("td",{rowSpan:i.length,children:t.Name}),s.jsx("td",{rowSpan:i.length,children:i.length}),s.jsx("td",{rowSpan:i.length,children:d.Present.length})]}),s.jsx("td",{colSpan:1,children:t.Name}),s.jsx("td",{colSpan:1,children:s.jsx("span",{className:`text-${d.Present.includes(t.Name)?"success":"danger"}`,children:d.Present.includes(t.Name)?"Present":"Not Present"})})]},`household_row_${v}`)}))})]})}),s.jsx("div",{children:" "}),s.jsxs("div",{className:"font-14",children:["Total Number of Occupants: ",s.jsx("span",{className:"ms-2",children:e==null?void 0:e.PreEvacuation.Evacuated.length})]}),s.jsxs("div",{className:"font-14",children:["Evacuation Center Capacity: ",s.jsx("span",{className:"ms-2",children:e==null?void 0:e.MaxCapacity})]}),s.jsxs("div",{className:"font-14",children:["Relief Packs Distributed: ",s.jsxs("span",{className:"ms-2",children:[(x=(m=e==null?void 0:e.Evacuation)==null?void 0:m.Distribution)==null?void 0:x.length," packs"]})]}),s.jsxs("div",{className:"font-14",children:["Excess Relief Packs: ",s.jsxs("span",{className:"ms-2",children:[(j=e==null?void 0:e.Evacuation)!=null&&j.Started&&(e!=null&&e.MaxCapacity)&&((u=e==null?void 0:e.Evacuation)!=null&&u.Distribution)?parseInt(e.MaxCapacity)-parseInt(e.Evacuation.Distribution.length):0," packs"]})]}),s.jsxs("div",{className:"font-14",children:["Total Relief Packs: ",s.jsxs("span",{className:"ms-2",children:[(N=e==null?void 0:e.Evacuation)!=null&&N.Started&&(e!=null&&e.MaxCapacity)?e.MaxCapacity:0," packs"]})]}),s.jsx("div",{children:" "}),s.jsx("div",{className:"right",children:s.jsx("table",{children:s.jsxs("tbody",{children:[s.jsx("tr",{children:s.jsx("td",{className:"fw-bold",style:{width:"3in"},children:"Prepared and Assessed by:"})}),s.jsx("tr",{children:s.jsx("td",{className:"font-14",children:" "})}),s.jsx("tr",{children:s.jsxs("td",{className:"fw-bold border-bottom text-center font-12",children:[c==null?void 0:c.FirstName," ",c!=null&&c.MiddleName?`${c==null?void 0:c.MiddleName[0]}. `:"",c==null?void 0:c.LastName]})}),s.jsx("tr",{children:s.jsxs("td",{className:"text-center",children:[c==null?void 0:c.Position," ",c==null?void 0:c.Office]})})]})})})]})]})}export{H as Component,p as loader};
