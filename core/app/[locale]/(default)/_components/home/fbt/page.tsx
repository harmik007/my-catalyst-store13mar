// import { getFBTProductsData } from './page-data';

// export default async function FBTPage() {
//   const fbtProducts = await getFBTProductsData();

//   console.log('FBT Products in Page:', fbtProducts);

//   return (
//     <div className="p-6">
//       <h1>FBT Products</h1>

//       <pre className="text-xs">
//         {JSON.stringify(fbtProducts, null, 2)}
//       </pre>
//     </div>
//   );
// }


import { getFBTProductsData } from './page-data';
import FBTClient from './fbt-client';

export default async function FBTPage() {
  const fbtProducts = await getFBTProductsData();

  return (
    <div className="p-6">
      <FBTClient data={fbtProducts} />
    </div>
  );
}