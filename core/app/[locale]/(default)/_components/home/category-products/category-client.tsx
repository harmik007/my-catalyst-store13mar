// 'use client';

// import { useEffect } from 'react';

// type Props = Readonly<{
//   data: any;
// }>;

// export default function CategoryClient({ data }: Props) {
//   useEffect(() => {
//     // Browser console log
//     console.log('CLIENT DATA:', data);
//   }, [data]);

//   return (
//     // <div className="mt-4 text-sm text-gray-600">
//     //   {/* Open browser console to see data */}
//     //   <h1>Category Client</h1>
//     //   <h1>{data?.name}</h1>
//     // </div>
//     <>   
//     <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">{data?.name}</h2>
//     <div className="max-w-7xl mx-auto px-4 py-10">
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//         {data.products.edges.map((product: any) => (
//           console.log("product", product),
//           <div
//             key={product.node.entityId}
//             className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
//           >
//             {/* Product Image */}
//             <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md">
//               <img
//                 src={product.node.defaultImage?.url}
//                 alt={product.node.name}
//                 className="object-contain h-full"
//               />
//             </div>

//             {/* Product Info */}
//             <h3 className="mt-4 text-lg font-semibold">
//               {product.node.name}
//             </h3>
//             <p className="text-gray-600">{product.node.prices.price.formatted}</p>

//             {/* Color Options */}
//             {/* <div className="flex gap-2 mt-3">
//               <span className="w-5 h-5 bg-gray-300 rounded"></span>
//               <span className="w-5 h-5 bg-black rounded"></span>
//               <span className="w-5 h-5 bg-purple-700 rounded"></span>
//               <span className="w-5 h-5 bg-blue-700 rounded"></span>
//               <span className="w-5 h-5 bg-green-600 rounded"></span>
//               <span className="w-5 h-5 bg-red-600 rounded"></span>
//               <span className="w-5 h-5 bg-orange-500 rounded"></span>
//             </div> */}

//             {/* Add to Cart Button */}
//             <button className="mt-5 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition">
//               Add to Cart
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//     </>
//   );
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import Link from 'next/link';

// type Props = Readonly<{
//   data: any;
// }>;

// export default function CategoryClient({ data }: Props) {
//   const [selectedOptions, setSelectedOptions] = useState<any>({});

//   useEffect(() => {
//     console.log('CLIENT DATA:', data);
//   }, [data]);

//   // Handle option selection
//   const handleOptionChange = (
//     productId: number,
//     optionId: number,
//     valueId: number
//   ) => {
//     setSelectedOptions((prev: any) => ({
//       ...prev,
//       [productId]: {
//         ...prev[productId],
//         [optionId]: valueId,
//       },
//     }));
//   };

//   // Add to cart
//   const handleAddToCart = async (product: any) => {
//     const selections = selectedOptions[product.entityId];

//     const requiredOptions = product.productOptions.edges.filter(
//       (opt: any) => opt.node.isRequired
//     );

//     if (
//       requiredOptions.length > 0 &&
//       (!selections ||
//         requiredOptions.some(
//           (opt: any) => !selections[opt.node.entityId]
//         ))
//     ) {
//       alert('Please select all required options');
//       return;
//     }

//     try {
//       const res = await fetch('/api/cart', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           lineItems: [
//             {
//               quantity: 1,
//               productId: product.entityId,
//               optionSelections: selections
//                 ? Object.entries(selections).map(
//                     ([optionId, valueId]) => ({
//                       optionId: Number(optionId),
//                       optionValue: Number(valueId),
//                     })
//                   )
//                 : [],
//             },
//           ],
//         }),
//       });

//       const result = await res.json();
//       console.log('Added to cart:', result);
//       alert('Product added to cart');
//     } catch (error) {
//       console.error('Add to cart error:', error);
//     }
//   };

//   return (
//     <>
//       {/* Category Title */}
//       <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
//         {data?.name}
//       </h2>

//       {/* Grid */}
//       <div className="max-w-7xl mx-auto px-4 py-10">
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {data?.products?.edges?.map((product: any) => {
//             const node = product.node;

//             return (
//               <div
//                 key={node.entityId}
//                 className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
//               >
//                 {/* Image (Clickable) */}
//                 <Link href={node.path}>
//                   <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer">
//                     <img
//                       src={node.defaultImage?.url}
//                       alt={node.name}
//                       className="object-contain h-full"
//                     />
//                   </div>
//                 </Link>

//                 {/* Name (Clickable) */}
//                 <h3 className="mt-4 text-lg font-semibold">
//                   <Link href={node.path} className="hover:underline">
//                     {node.name}
//                   </Link>
//                 </h3>

//                 {/* Price */}
//                 <p className="text-gray-600">
//                   {node.prices?.price?.formatted}
//                 </p>

//                 {/* Product Options */}
//                 {node.productOptions?.edges?.map((opt: any) => {
//                   const option = opt.node;

//                   if (option.__typename === 'MultipleChoiceOption') {
//                     return (
//                       <div key={option.entityId} className="mt-3">
//                         <label className="block text-sm font-medium">
//                           {option.displayName}
//                         </label>

//                         <select
//                           className="mt-1 w-full border rounded p-2"
//                           value={
//                             selectedOptions[node.entityId]?.[
//                               option.entityId
//                             ] || ''
//                           }
//                           onChange={(e) =>
//                             handleOptionChange(
//                               node.entityId,
//                               option.entityId,
//                               Number(e.target.value)
//                             )
//                           }
//                         >
//                           <option value="">
//                             Select {option.displayName}
//                           </option>

//                           {option.values.edges.map((val: any) => (
//                             <option
//                               key={val.node.entityId}
//                               value={val.node.entityId}
//                             >
//                               {val.node.label}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     );
//                   }

//                   return null;
//                 })}

//                 {/* Add to Cart */}
//                 <button
//                   onClick={() => handleAddToCart(node)}
//                   className="mt-5 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
//                 >
//                   Add to Cart
//                 </button>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </>
//   );
// }


'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormStatus } from 'react-dom';

import { addToCart } from './add-to-cart';

type Props = Readonly<{
  data: any;
}>;

// Loading Button Component
function AddToCartButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50"
    >
      {pending ? 'Adding...' : 'Add to Cart'}
    </button>
  );
}

// Product Card Component with Form State
function ProductCard({ node, selectedOptions, onOptionChange }: Readonly<{
  node: any;
  selectedOptions: any;
  onOptionChange: (productId: number, optionId: number, valueId: number) => void;
}>) {
  const handleAddToCart = async (formData: FormData) => {
    // Check for required options
    const requiredOptions = node.productOptions?.edges?.filter(
      (opt: any) => opt.node.isRequired
    );

    if (requiredOptions && requiredOptions.length > 0) {
      const currentSelections = selectedOptions[node.entityId] || {};
      const missingRequiredOptions = requiredOptions.filter(
        (opt: any) => !currentSelections[opt.node.entityId]
      );

      if (missingRequiredOptions.length > 0) {
        const missingNames = missingRequiredOptions.map((opt: any) => opt.node.displayName).join(', ');
        alert(`Please select required options: ${missingNames}`);
        return;
      }
    }

    await addToCart({ lastResult: null }, formData);
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      {/* Image (Clickable) */}
      <Link href={node.path}>
        <div className="w-full h-64 flex items-center justify-center bg-gray-100 rounded-md cursor-pointer">
          <img
            src={node.defaultImage?.url}
            alt={node.name}
            className="object-contain h-full"
          />
        </div>
      </Link>

      {/* Name (Clickable) */}
      <h3 className="mt-4 text-lg font-semibold">
        <Link href={node.path} className="hover:underline">
          {node.name}
        </Link>
      </h3>

      {/* Price */}
      <p className="text-gray-600">
        {node.prices?.price?.formatted}
      </p>

      {/* Product Options */}
      {node.productOptions?.edges?.map((opt: any) => {
        const option = opt.node;

        if (option.__typename === 'MultipleChoiceOption') {
          return (
            <div key={option.entityId} className="mt-3">
              <label className="block text-sm font-medium">
                {option.displayName}
                {option.isRequired && <span className="text-red-500 ml-1">*</span>}
              </label>

              <select
                className="mt-1 w-full border rounded p-2"
                value={
                  selectedOptions[node.entityId]?.[
                    option.entityId
                  ] || ''
                }
                onChange={(e) =>
                  onOptionChange(
                    node.entityId,
                    option.entityId,
                    Number(e.target.value)
                  )
                }
                required={option.isRequired}
              >
                <option value="">
                  Select {option.displayName}{option.isRequired && ' *'}
                </option>

                {option.values.edges.map((val: any) => (
                  <option
                    key={val.node.entityId}
                    value={val.node.entityId}
                  >
                    {val.node.label}
                  </option>
                ))}
              </select>
            </div>
          );
        }

        return null;
      })}

      {/* Add to Cart (Server Action) */}
      <form action={handleAddToCart} className="space-y-3">
        <input
          type="hidden"
          name="id"
          value={String(node.entityId)}
        />
        <input
          type="hidden"
          name="locale"
          value="en"
        />
        
        {/* Hidden fields for options and gift wrapping */}
        {selectedOptions[node.entityId] && (
          <input
            type="hidden"
            name="optionSelections"
            value={JSON.stringify(
              Object.entries(selectedOptions[node.entityId]).map(
                ([optionId, valueId]) => ({
                  optionId: Number(optionId),
                  optionValue: String(valueId),
                })
              )
            )}
          />
        )}

        <AddToCartButton />
      </form>
    </div>
  );
}

export default function CategoryClient({ data }: Props) {
  const [selectedOptions, setSelectedOptions] = useState<any>({});

  useEffect(() => {
    console.log('CLIENT DATA:', data);
  }, [data]);

  // Option change handler
  const handleOptionChange = (
    productId: number,
    optionId: number,
    valueId: number
  ) => {
    setSelectedOptions((prev: any) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        [optionId]: valueId,
      },
    }));
  };

  return (
    <>
      {/* Category Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
        {data?.name}
      </h2>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {data?.products?.edges?.map((product: any) => (
            <ProductCard
              key={product.node.entityId}
              node={product.node}
              selectedOptions={selectedOptions}
              onOptionChange={handleOptionChange}
            />
          ))}
        </div>
      </div>
    </>
  );
}