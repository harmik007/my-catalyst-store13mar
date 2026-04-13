// 'use client';

// import { useState } from 'react';

// type Product = {
//   entityId: number;
//   name: string;
//   prices?: {
//     price?: {
//       value: number;
//       formatted: string;
//     };
//   };
//   images?: {
//     edges: {
//       node: {
//         urlOriginal: string;
//         altText: string;
//       };
//     }[];
//   };
//   inventory?: {
//     isInStock: boolean;
//   };
// };

// export default function FBTClient({ data }: { data: any[] }) {
//   const products: Product[] = data.map((item: any) => item.node);

//   const [selected, setSelected] = useState<number[]>(
//     products.map((p) => p.entityId)
//   );

//   const toggleProduct = (id: number) => {
//     setSelected((prev) =>
//       prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
//     );
//   };

//   const selectAll = () => {
//     setSelected(products.map((p) => p.entityId));
//   };

//   const totalPrice = products
//     .filter((p) => selected.includes(p.entityId))
//     .reduce((sum, p) => sum + (p.prices?.price?.value || 0), 0);

//   return (
//     <div className="p-6 border rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">
//         Frequently Bought Together
//       </h2>

//       {/* Top Images Row */}
//       <div className="flex items-center gap-4 mb-6">
//         {products.map((p, index) => (
//           <div key={p.entityId} className="flex items-center gap-4">
//             <img
//               src={p.images?.edges?.[0]?.node?.urlOriginal}
//               alt={p.name}
//               className="w-20 h-20 object-cover border rounded"
//             />
//             {index < products.length - 1 && <span>+</span>}
//           </div>
//         ))}
//       </div>

//       {/* Total + Buttons */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="text-lg font-medium">
//           Total Price: ${totalPrice.toFixed(2)}
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={selectAll}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             SELECT ALL
//           </button>

//           <button className="px-4 py-2 bg-blue-600 text-white rounded">
//             ADD TO CART
//           </button>
//         </div>
//       </div>

//       {/* Product List */}
//       <div className="space-y-4">
//         {products.map((p) => {
//           const isSelected = selected.includes(p.entityId);

//           return (
//             <div key={p.entityId} className="flex items-start gap-3">
//               <input
//                 type="checkbox"
//                 checked={isSelected}
//                 onChange={() => toggleProduct(p.entityId)}
//               />

//               <div>
//                 <p className="font-medium">{p.name}</p>

//                 <p className="text-sm text-gray-600">
//                   {p.prices?.price?.formatted}
//                 </p>

//                 {!p.inventory?.isInStock && (
//                   <p className="text-red-500 text-sm">Out of stock</p>
//                 )}

//                 <button className="mt-2 px-3 py-1 bg-orange-500 text-white text-sm rounded">
//                   Choose Options
//                 </button>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// ===========================
// 'use client';

// import { useEffect, useState } from 'react';

// export default function FBTClient({ data }: { data: any[] }) {
//   const products = data.map((item: any) => item.node);

//   const [selected, setSelected] = useState<number[]>([]);
//   const [showOptions, setShowOptions] = useState<any>({});
//   const [selectedOptions, setSelectedOptions] = useState<any>({});
//   const [total, setTotal] = useState(0);

//   // ✅ INIT SELECTED (ONLY IN STOCK)
//   useEffect(() => {
//     const initial = products
//       .filter((p) => p.inventory?.isInStock)
//       .map((p) => p.entityId);

//     setSelected(initial);
//   }, [data]);

//   // ✅ TOTAL PRICE
//   useEffect(() => {
//     let sum = 0;

//     products.forEach((p) => {
//       if (selected.includes(p.entityId)) {
//         sum += p.prices?.price?.value || 0;
//       }
//     });

//     setTotal(sum);
//   }, [selected, data]);

//   // ✅ FIXED TOGGLE (MAIN ISSUE FIXED HERE)
//   const toggleProduct = (productId: number, isInStock: boolean) => {
//     if (!isInStock) return;

//     setSelected((prev) => {
//       if (prev.includes(productId)) {
//         return prev.filter((id) => id !== productId);
//       } else {
//         return [...prev, productId];
//       }
//     });
//   };

//   // ✅ SELECT ALL (FIXED)
//   const handleSelectAll = () => {
//     const allInStock = products
//       .filter((p) => p.inventory?.isInStock)
//       .map((p) => p.entityId);

//     setSelected(allInStock);
//   };

//   // ✅ TOGGLE OPTIONS
//   const toggleOptions = (id: number) => {
//     setShowOptions((prev: any) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ OPTION CHANGE
//   const handleOptionChange = (productId: number, optionId: number, value: any) => {
//     setSelectedOptions((prev: any) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [optionId]: value,
//       },
//     }));
//   };

//   // ✅ VALIDATION
//   const validateProduct = (p: any) => {
//     const options = p.productOptions?.edges || [];

//     for (let opt of options) {
//       const node = opt.node;

//       if (node.isRequired) {
//         const selectedVal = selectedOptions?.[p.entityId]?.[node.entityId];
//         if (!selectedVal) {
//           alert(`Please select ${node.displayName} for ${p.name}`);
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   // ✅ ADD TO CART (READY)
//   const handleAddToCart = () => {
//     if (selected.length === 0) {
//       alert('Please select at least one product');
//       return;
//     }

//     for (let p of products) {
//       if (selected.includes(p.entityId)) {
//         if (!validateProduct(p)) return;
//       }
//     }

//     console.log('FINAL CART DATA:', {
//       selected,
//       selectedOptions,
//     });

//     alert('All good ✅ (Next: GraphQL cart)');
//   };

//   return (
//     <div className="p-6 border rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">
//         Frequently Bought Together
//       </h2>

//       {/* ✅ IMAGE ROW */}
//       <div className="flex gap-4 mb-6 items-center">
//         {products.map((p, i) => (
//           <div key={p.entityId} className="flex items-center gap-2">
//             <img
//               src={p.images?.edges?.[0]?.node?.urlOriginal}
//               className={`w-20 h-20 border rounded ${
//                 selected.includes(p.entityId) ? '' : 'opacity-40'
//               }`}
//             />
//             {i < products.length - 1 && <span>+</span>}
//           </div>
//         ))}
//       </div>

//       {/* ✅ TOTAL + BUTTONS */}
//       <div className="flex justify-between mb-6">
//         <div className="text-lg font-medium">
//           Total Price: ${total.toFixed(2)}
//         </div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleSelectAll}
//             className="bg-blue-600 text-white px-4 py-2"
//           >
//             SELECT ALL
//           </button>

//           <button
//             onClick={handleAddToCart}
//             className="bg-blue-600 text-white px-4 py-2"
//           >
//             ADD TO CART
//           </button>
//         </div>
//       </div>

//       {/* ✅ PRODUCT LIST */}
//       <div className="space-y-6">
//         {products.map((p) => {
//           const isSelected = selected.includes(p.entityId);
//           const isOut = !p.inventory?.isInStock;
//           const hasOptions = p.productOptions?.edges?.length > 0;

//           return (
//             <div key={p.entityId}>
//               <div className="flex gap-3">
//                 {/* ✅ CHECKBOX (FIXED) */}
//                 <input
//                   type="checkbox"
//                   checked={isSelected}
//                   disabled={isOut}
//                   onChange={() =>
//                     toggleProduct(p.entityId, p.inventory?.isInStock)
//                   }
//                 />

//                 <div>
//                   <p className="font-medium">{p.name}</p>

//                   <p>{p.prices?.price?.formatted}</p>

//                   {isOut && (
//                     <p className="text-red-500 font-semibold">
//                       Out of stock
//                     </p>
//                   )}

//                   {/* ✅ CHOOSE OPTIONS */}
//                   {hasOptions && (
//                     <button
//                       onClick={() => toggleOptions(p.entityId)}
//                       className="mt-2 bg-orange-500 text-white px-3 py-1"
//                     >
//                       Choose Options
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* ✅ OPTIONS */}
//               {showOptions[p.entityId] && (
//                 <div className="ml-6 mt-3 border p-3 rounded">
//                   {p.productOptions.edges.map((opt: any) => {
//                     const node = opt.node;

//                     if (node.__typename === 'MultipleChoiceOption') {
//                       const style = node.displayStyle;

//                       return (
//                         <div key={node.entityId} className="mb-4">
//                           <p>
//                             {node.displayName} {node.isRequired && '*'}
//                           </p>

//                           {/* RADIO */}
//                           {(style === 'RadioButtons' ||
//                             style === 'RectangleBoxes') && (
//                             <div className="flex gap-2">
//                               {node.values.edges.map((v: any) => {
//                                 const isSel =
//                                   selectedOptions?.[p.entityId]?.[
//                                     node.entityId
//                                   ] == v.node.entityId;

//                                 return (
//                                   <button
//                                     key={v.node.entityId}
//                                     onClick={() =>
//                                       handleOptionChange(
//                                         p.entityId,
//                                         node.entityId,
//                                         v.node.entityId
//                                       )
//                                     }
//                                     className={`px-3 py-1 border rounded ${
//                                       isSel
//                                         ? 'bg-black text-white'
//                                         : ''
//                                     }`}
//                                   >
//                                     {v.node.label}
//                                   </button>
//                                 );
//                               })}
//                             </div>
//                           )}

//                           {/* SWATCH */}
//                           {style === 'Swatch' && (
//                             <div className="flex gap-2">
//                               {node.values.edges.map((v: any) => {
//                                 const isSel =
//                                   selectedOptions?.[p.entityId]?.[
//                                     node.entityId
//                                   ] == v.node.entityId;

//                                 return (
//                                   <div
//                                     key={v.node.entityId}
//                                     onClick={() =>
//                                       handleOptionChange(
//                                         p.entityId,
//                                         node.entityId,
//                                         v.node.entityId
//                                       )
//                                     }
//                                     className={`w-8 h-8 rounded-full border cursor-pointer ${
//                                       isSel
//                                         ? 'ring-2 ring-black'
//                                         : ''
//                                     }`}
//                                     style={{
//                                       backgroundColor:
//                                         v.node.hexColors?.[0] ||
//                                         '#ccc',
//                                     }}
//                                   />
//                                 );
//                               })}
//                             </div>
//                           )}

//                           {/* DROPDOWN */}
//                           {style === 'DropdownList' && (
//                             <select
//                               className="border p-2 w-full"
//                               onChange={(e) =>
//                                 handleOptionChange(
//                                   p.entityId,
//                                   node.entityId,
//                                   e.target.value
//                                 )
//                               }
//                             >
//                               <option value="">Select</option>
//                               {node.values.edges.map((v: any) => (
//                                 <option
//                                   key={v.node.entityId}
//                                   value={v.node.entityId}
//                                 >
//                                   {v.node.label}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       );
//                     }

//                     return null;
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }

// ==========================

// 'use client';

// import { useEffect, useState } from 'react';

// export default function FBTClient({ data }: { data: any[] }) {
//   const products = data.map((item: any) => item.node);

//   const [selected, setSelected] = useState<number[]>([]);
//   const [showOptions, setShowOptions] = useState<any>({});
//   const [selectedOptions, setSelectedOptions] = useState<any>({});
//   const [total, setTotal] = useState(0);

//   // ✅ INIT (only in stock selected)
//   useEffect(() => {
//     const initial = products
//       .filter((p) => p.inventory?.isInStock)
//       .map((p) => p.entityId);

//     setSelected(initial);
//   }, [data]);

//   // ✅ TOTAL PRICE
//   useEffect(() => {
//     let sum = 0;

//     products.forEach((p) => {
//       if (selected.includes(p.entityId)) {
//         sum += p.prices?.price?.value || 0;
//       }
//     });

//     setTotal(sum);
//   }, [selected]);

//   // ✅ TOGGLE PRODUCT
//   const toggleProduct = (id: number, inStock: boolean) => {
//     if (!inStock) return;

//     setSelected((prev) =>
//       prev.includes(id)
//         ? prev.filter((i) => i !== id)
//         : [...prev, id]
//     );
//   };

//   // ✅ SELECT ALL
//   const handleSelectAll = () => {
//     const all = products
//       .filter((p) => p.inventory?.isInStock)
//       .map((p) => p.entityId);

//     setSelected(all);
//   };

//   // ✅ TOGGLE OPTIONS
//   const toggleOptions = (id: number) => {
//     setShowOptions((prev: any) => ({
//       ...prev,
//       [id]: !prev[id],
//     }));
//   };

//   // ✅ OPTION CHANGE
//   const handleOptionChange = (
//     productId: number,
//     optionId: number,
//     value: any
//   ) => {
//     setSelectedOptions((prev: any) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [optionId]: value,
//       },
//     }));
//   };

//   // ✅ VALIDATION
//   const validateProduct = (p: any) => {
//     const options = p.productOptions?.edges || [];

//     for (let opt of options) {
//       const node = opt.node;

//       if (node.isRequired) {
//         const val =
//           selectedOptions?.[p.entityId]?.[node.entityId];

//         if (!val || val === '') {
//           alert(`Please select ${node.displayName}`);
//           return false;
//         }
//       }
//     }

//     return true;
//   };

//   // ✅ ADD TO CART (SIMPLE LIKE YOUR REFERENCE)
//   const handleAddToCart = async () => {
//     if (selected.length === 0) {
//       alert('Please select at least one product');
//       return;
//     }

//     for (let p of products) {
//       if (selected.includes(p.entityId)) {
//         if (!validateProduct(p)) return;
//       }
//     }

//     // 👉 submit one by one
//     for (let i = 0; i < selected.length; i++) {
//       const productId = selected[i];

//       const formData = new FormData();
//       formData.append('action', 'add');
//       formData.append('product_id', productId.toString());
//       formData.append('qty[]', '1');

//       // options
//       const options = selectedOptions[productId] || {};
//       Object.keys(options).forEach((key) => {
//         formData.append(`attribute[${key}]`, options[key]);
//       });

//       try {
//         await fetch('/cart.php', {
//           method: 'POST',
//           body: formData,
//         });

//         console.log('Added:', productId);
//       } catch (err) {
//         console.error(err);
//       }

//       await new Promise((res) => setTimeout(res, 500));
//     }

//     alert('Products added to cart ✅');
//     window.location.reload();
//   };

//   return (
//     <div className="p-6 border rounded-lg">
//       <h2 className="text-xl font-semibold mb-4">
//         Frequently Bought Together
//       </h2>

//       {/* ✅ IMAGE ROW */}
//       <div className="flex gap-4 mb-6">
//         {products.map((p, i) => (
//           <div key={p.entityId} className="flex items-center gap-2">
//             <img
//               src={p.images?.edges?.[0]?.node?.urlOriginal}
//               className={`w-20 h-20 border ${
//                 selected.includes(p.entityId)
//                   ? ''
//                   : 'opacity-40'
//               }`}
//             />
//             {i < products.length - 1 && <span>+</span>}
//           </div>
//         ))}
//       </div>

//       {/* ✅ TOTAL */}
//       <div className="flex justify-between mb-6">
//         <div>Total Price: ${total.toFixed(2)}</div>

//         <div className="flex gap-3">
//           <button
//             onClick={handleSelectAll}
//             className="bg-blue-600 text-white px-4 py-2"
//           >
//             SELECT ALL
//           </button>

//           <button
//             onClick={handleAddToCart}
//             className="bg-blue-600 text-white px-4 py-2"
//           >
//             ADD TO CART
//           </button>
//         </div>
//       </div>

//       {/* ✅ PRODUCT LIST */}
//       <div className="space-y-5">
//         {products.map((p) => {
//           const isOut = !p.inventory?.isInStock;
//           const hasOptions =
//             p.productOptions?.edges?.length > 0;

//           return (
//             <div key={p.entityId}>
//               <div className="flex gap-3">
//                 <input
//                   type="checkbox"
//                   checked={selected.includes(p.entityId)}
//                   disabled={isOut}
//                   onChange={() =>
//                     toggleProduct(
//                       p.entityId,
//                       p.inventory?.isInStock
//                     )
//                   }
//                 />

//                 <div>
//                   <p>{p.name}</p>
//                   <p>{p.prices?.price?.formatted}</p>

//                   {isOut && (
//                     <p className="text-red-500">
//                       Out of stock
//                     </p>
//                   )}

//                   {hasOptions && (
//                     <button
//                       onClick={() =>
//                         toggleOptions(p.entityId)
//                       }
//                       className="bg-orange-500 text-white px-3 py-1 mt-2"
//                     >
//                       Choose Options
//                     </button>
//                   )}
//                 </div>
//               </div>

//               {/* ✅ OPTIONS UI */}
//               {showOptions[p.entityId] && (
//                 <div className="ml-6 mt-3 border p-3">
//                   {p.productOptions.edges.map((opt: any) => {
//                     const node = opt.node;

//                     if (node.__typename === 'MultipleChoiceOption') {
//                       const style = node.displayStyle;

//                       return (
//                         <div key={node.entityId} className="mb-4">
//                           <p>
//                             {node.displayName}{' '}
//                             {node.isRequired && '*'}
//                           </p>

//                           {/* RADIO */}
//                           {(style === 'RadioButtons' ||
//                             style === 'RectangleBoxes') && (
//                             <div className="flex gap-2">
//                               {node.values.edges.map((v: any) => {
//                                 const isSel =
//                                   selectedOptions?.[
//                                     p.entityId
//                                   ]?.[node.entityId] ==
//                                   v.node.entityId;

//                                 return (
//                                   <button
//                                     key={v.node.entityId}
//                                     onClick={() =>
//                                       handleOptionChange(
//                                         p.entityId,
//                                         node.entityId,
//                                         v.node.entityId
//                                       )
//                                     }
//                                     className={`px-3 py-1 border rounded ${
//                                       isSel
//                                         ? 'bg-black text-white'
//                                         : ''
//                                     }`}
//                                   >
//                                     {v.node.label}
//                                   </button>
//                                 );
//                               })}
//                             </div>
//                           )}

//                           {/* SWATCH */}
//                           {style === 'Swatch' && (
//                             <div className="flex gap-2">
//                               {node.values.edges.map((v: any) => {
//                                 const isSel =
//                                   selectedOptions?.[
//                                     p.entityId
//                                   ]?.[node.entityId] ==
//                                   v.node.entityId;

//                                 return (
//                                   <div
//                                     key={v.node.entityId}
//                                     onClick={() =>
//                                       handleOptionChange(
//                                         p.entityId,
//                                         node.entityId,
//                                         v.node.entityId
//                                       )
//                                     }
//                                     className={`w-8 h-8 rounded-full border cursor-pointer ${
//                                       isSel
//                                         ? 'ring-2 ring-black'
//                                         : ''
//                                     }`}
//                                     style={{
//                                       backgroundColor:
//                                         v.node.hexColors?.[0] ||
//                                         '#ccc',
//                                     }}
//                                   />
//                                 );
//                               })}
//                             </div>
//                           )}

//                           {/* DROPDOWN */}
//                           {style === 'DropdownList' && (
//                             <select
//                               className="border p-2 w-full"
//                               onChange={(e) =>
//                                 handleOptionChange(
//                                   p.entityId,
//                                   node.entityId,
//                                   e.target.value
//                                 )
//                               }
//                             >
//                               <option value="">Select</option>
//                               {node.values.edges.map((v: any) => (
//                                 <option
//                                   key={v.node.entityId}
//                                   value={v.node.entityId}
//                                 >
//                                   {v.node.label}
//                                 </option>
//                               ))}
//                             </select>
//                           )}
//                         </div>
//                       );
//                     }

//                     return null;
//                   })}
//                 </div>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }


// =====================


'use client';

import { useEffect, useRef, useState, useActionState } from 'react';
import { addFBTToCart } from './fbt-cart-action';

export default function FBTClient({ data }: { data: any[] }) {
  const products = data.map((item: any) => item.node);

  const [selected, setSelected]           = useState<number[]>([]);
  const [showOptions, setShowOptions]     = useState<Record<number, boolean>>({});
  const [selectedOptions, setSelectedOptions] = useState<Record<number, Record<number, any>>>({});
  const [total, setTotal]                 = useState(0);
  const formRef                           = useRef<HTMLFormElement>(null);

  // useActionState wires the <form action> directly to the server action
  const [state, formAction, isPending] = useActionState(addFBTToCart, null);

  // ── Pre-select in-stock products ──────────────────────────────────────────
  useEffect(() => {
    setSelected(
      products.filter((p) => p.inventory?.isInStock).map((p) => p.entityId)
    );
  }, [data]);

  // ── Recalculate total ─────────────────────────────────────────────────────
  useEffect(() => {
    const sum = products
      .filter((p) => selected.includes(p.entityId))
      .reduce((acc, p) => acc + (p.prices?.price?.value ?? 0), 0);
    setTotal(sum);
  }, [selected]);

  // ── Reload on success so header cart count updates ────────────────────────
  useEffect(() => {
    if (state?.success) {
      setTimeout(() => window.location.reload(), 1000);
    }
  }, [state]);

  const toggleProduct = (id: number, inStock: boolean) => {
    if (!inStock) return;
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () =>
    setSelected(
      products.filter((p) => p.inventory?.isInStock).map((p) => p.entityId)
    );

  const toggleOptions = (id: number) =>
    setShowOptions((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleOptionChange = (productId: number, optionId: number, value: any) =>
    setSelectedOptions((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [optionId]: value },
    }));

  // ── Client-side validation before submit ──────────────────────────────────
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (selected.length === 0) {
      e.preventDefault();
      alert('Please select at least one product.');
      return;
    }

    // 🔍 DEBUG: Log selected products and options before submit
    console.log('🚀 FBT Submit Debug:', {
      selectedProducts: selected,
      selectedOptions: selectedOptions,
      productsData: products.filter(p => selected.includes(p.entityId)).map(p => ({
        id: p.entityId,
        name: p.name,
        price: p.prices?.price?.formatted,
        options: p.productOptions?.edges?.length || 0
      })),
      timestamp: new Date().toISOString()
    });

    for (const p of products) {
      if (!selected.includes(p.entityId)) continue;
      for (const opt of p.productOptions?.edges ?? []) {
        const node = opt.node;
        if (node.isRequired && !selectedOptions?.[p.entityId]?.[node.entityId]) {
          e.preventDefault();
          alert(`Please select "${node.displayName}" for "${p.name}"`);
          return;
        }
      }
    }
    // ✅ Validation passed — form submits natively to server action
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit}>
      <div className="p-6 border rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Frequently Bought Together</h2>

        {/* ── Hidden fields — encode all selected products for the server action ── */}
        {products.reduce((acc, product) => {
          const selectedIndex = selected.includes(product.entityId);
          if (selectedIndex) {
            const fieldIndex = acc.length;
            acc.push(
              <div key={`fields-${product.entityId}`}>
                {/*
                  product_N_id  = productEntityId
                  product_N_qty = quantity
                  product_N_option_<optionEntityId> = optionValueEntityId
                  — same naming as Stencil's cart.php, now parsed server-side
                */}
                <input type="hidden" name={`product_${fieldIndex}_id`}  value={product.entityId} />
                <input type="hidden" name={`product_${fieldIndex}_qty`} value="1" />
                {Object.entries(selectedOptions[product.entityId] ?? {}).map(
                  ([optionId, valueId]) => (
                    <input
                      key={optionId}
                      type="hidden"
                      name={`product_${fieldIndex}_option_${optionId}`}
                      value={valueId as string}
                    />
                  )
                )}
              </div>
            );
          }
          return acc;
        }, [])}

        {/* ── Image row ── */}
        <div className="flex flex-wrap gap-4 mb-6">
          {products.map((p, i) => (
            <div key={p.entityId} className="flex items-center gap-2">
              <img
                src={p.images?.edges?.[0]?.node?.urlOriginal}
                alt={p.name}
                className={`w-20 h-20 object-cover border transition-opacity ${
                  selected.includes(p.entityId) ? 'opacity-100' : 'opacity-40'
                }`}
              />
              {i < products.length - 1 && (
                <span className="text-xl font-bold text-gray-400">+</span>
              )}
            </div>
          ))}
        </div>

        {/* ── Total + action buttons ── */}
        <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
          <div className="font-medium text-lg">
            Total: <span className="text-blue-700">${total.toFixed(2)}</span>
          </div>

          <div className="flex gap-3">
            {/* Select All is a plain button — does NOT submit the form */}
            <button
              type="button"
              onClick={handleSelectAll}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
            >
              Select All
            </button>

            {/* Submit triggers the server action via form action */}
            <button
              type="submit"
              disabled={isPending}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
            >
              {isPending ? 'Adding…' : 'Add All to Cart'}
            </button>
          </div>
        </div>

        {/* ── Status message from server action ── */}
        {state && (
          <p
            className={`mb-4 text-sm font-medium ${
              state.success ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {state.success ? '✅' : '❌'} {state.message}
          </p>
        )}

        {/* ── Product list ── */}
        <div className="space-y-5">
          {products.map((p) => {
            const isOut     = !p.inventory?.isInStock;
            const hasOptions = (p.productOptions?.edges?.length ?? 0) > 0;

            return (
              <div key={p.entityId} className="border-b pb-4">
                <div className="flex gap-3 items-start">
                  {/* Checkbox is type=button to avoid polluting FormData */}
                  <input
                    type="checkbox"
                    checked={selected.includes(p.entityId)}
                    disabled={isOut}
                    onChange={() => toggleProduct(p.entityId, p.inventory?.isInStock)}
                    className="mt-1 cursor-pointer"
                    // NOT a form field — selection is encoded in hidden inputs above
                  />

                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-gray-500 text-sm">{p.prices?.price?.formatted}</p>
                    {isOut && <p className="text-red-500 text-xs mt-1">Out of stock</p>}

                    {hasOptions && (
                      <button
                        type="button"
                        onClick={() => toggleOptions(p.entityId)}
                        className="mt-2 bg-orange-500 text-white text-sm px-3 py-1 rounded hover:bg-orange-600"
                      >
                        {showOptions[p.entityId] ? 'Hide Options' : 'Choose Options'}
                      </button>
                    )}
                  </div>
                </div>

                {/* ── Options panel ── */}
                {showOptions[p.entityId] && (
                  <div className="ml-6 mt-3 border p-3 rounded bg-gray-50">
                    {p.productOptions.edges.map((opt: any) => {
                      const node = opt.node;

                      if (node.__typename === 'MultipleChoiceOption') {
                        const style = node.displayStyle;

                        return (
                          <div key={node.entityId} className="mb-4">
                            <p className="font-medium mb-1 text-sm">
                              {node.displayName}
                              {node.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </p>

                            {/* Radio / Rectangle */}
                            {(style === 'RadioButtons' || style === 'RectangleBoxes') && (
                              <div className="flex flex-wrap gap-2">
                                {node.values.edges.map((v: any) => {
                                  const isSel =
                                    selectedOptions?.[p.entityId]?.[node.entityId] == v.node.entityId;
                                  return (
                                    <button
                                      type="button"
                                      key={v.node.entityId}
                                      onClick={() =>
                                        handleOptionChange(p.entityId, node.entityId, v.node.entityId)
                                      }
                                      className={`px-3 py-1 border rounded text-sm ${
                                        isSel ? 'bg-black text-white border-black' : 'hover:border-gray-500'
                                      }`}
                                    >
                                      {v.node.label}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {/* Swatch */}
                            {style === 'Swatch' && (
                              <div className="flex flex-wrap gap-2">
                                {node.values.edges.map((v: any) => {
                                  const isSel =
                                    selectedOptions?.[p.entityId]?.[node.entityId] == v.node.entityId;
                                  return (
                                    <div
                                      key={v.node.entityId}
                                      title={v.node.label}
                                      onClick={() =>
                                        handleOptionChange(p.entityId, node.entityId, v.node.entityId)
                                      }
                                      className={`w-8 h-8 rounded-full border-2 cursor-pointer ${
                                        isSel ? 'ring-2 ring-offset-1 ring-black' : 'border-gray-300'
                                      }`}
                                      style={{ backgroundColor: v.node.hexColors?.[0] || '#ccc' }}
                                    />
                                  );
                                })}
                              </div>
                            )}

                            {/* Dropdown */}
                            {style === 'DropdownList' && (
                              <select
                                className="border p-2 rounded w-full text-sm"
                                value={selectedOptions?.[p.entityId]?.[node.entityId] || ''}
                                onChange={(e) =>
                                  handleOptionChange(p.entityId, node.entityId, e.target.value)
                                }
                              >
                                <option value="">-- Select {node.displayName} --</option>
                                {node.values.edges.map((v: any) => (
                                  <option key={v.node.entityId} value={v.node.entityId}>
                                    {v.node.label}
                                  </option>
                                ))}
                              </select>
                            )}
                          </div>
                        );
                      }

                      /* Text / Number fields */
                      if (
                        node.__typename === 'TextFieldOption' ||
                        node.__typename === 'NumberFieldOption'
                      ) {
                        return (
                          <div key={node.entityId} className="mb-4">
                            <p className="font-medium mb-1 text-sm">
                              {node.displayName}
                              {node.isRequired && <span className="text-red-500 ml-1">*</span>}
                            </p>
                            <input
                              type={node.__typename === 'NumberFieldOption' ? 'number' : 'text'}
                              className="border p-2 rounded w-full text-sm"
                              value={selectedOptions?.[p.entityId]?.[node.entityId] || ''}
                              onChange={(e) =>
                                handleOptionChange(p.entityId, node.entityId, e.target.value)
                              }
                              placeholder={`Enter ${node.displayName}`}
                            />
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </form>
  );
}