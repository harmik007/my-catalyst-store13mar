import { removeEdgesAndNodes } from '@bigcommerce/catalyst-client';
import { Metadata } from 'next';
import { getFormatter, getTranslations, setRequestLocale } from 'next-intl/server';

import { Stream, Streamable } from '@/vibes/soul/lib/streamable';
import { FeaturedProductCarousel } from '@/vibes/soul/sections/featured-product-carousel';
import { FeaturedProductList } from '@/vibes/soul/sections/featured-product-list';
import { getSessionCustomerAccessToken } from '~/auth';
import { Subscribe } from '~/components/subscribe';
import { productCardTransformer } from '~/data-transformers/product-card-transformer';
import { getPreferredCurrencyCode } from '~/lib/currency';
import { getMetadataAlternates } from '~/lib/seo/canonical';

import { Slideshow } from './_components/slideshow';
import { getPageData } from './page-data';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    alternates: await getMetadataAlternates({ path: '/', locale }),
  };
}

export default async function Home({ params }: Props) {
  const { locale } = await params;

  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const format = await getFormatter();

  const streamablePageData = Streamable.from(async () => {
    const customerAccessToken = await getSessionCustomerAccessToken();
    const currencyCode = await getPreferredCurrencyCode();

    return getPageData(currencyCode, customerAccessToken);
  });

  const streamableFeaturedProducts = Streamable.from(async () => {
    const data = await streamablePageData;

    const featuredProducts = removeEdgesAndNodes(data.site.featuredProducts);

    const { defaultOutOfStockMessage, showOutOfStockMessage, showBackorderMessage } =
      data.site.settings?.inventory ?? {};

    return productCardTransformer(
      featuredProducts,
      format,
      showOutOfStockMessage ? defaultOutOfStockMessage : undefined,
      showBackorderMessage,
    );
  });

  const streamableNewestProducts = Streamable.from(async () => {
    const data = await streamablePageData;

    const newestProducts = removeEdgesAndNodes(data.site.newestProducts);

    const { defaultOutOfStockMessage, showOutOfStockMessage, showBackorderMessage } =
      data.site.settings?.inventory ?? {};

    return productCardTransformer(
      newestProducts,
      format,
      showOutOfStockMessage ? defaultOutOfStockMessage : undefined,
      showBackorderMessage,
    );
  });

  const streamableShowNewsletterSignup = Streamable.from(async () => {
    const data = await streamablePageData;

    const { showNewsletterSignup } = data.site.settings?.newsletter ?? {};

    return showNewsletterSignup;
  });

  return (
    <>
      <Slideshow />

      <FeaturedProductList
        cta={{ label: t('FeaturedProducts.cta'), href: '/shop-all' }}
        description={t('FeaturedProducts.description')}
        emptyStateSubtitle={t('FeaturedProducts.emptyStateSubtitle')}
        emptyStateTitle={t('FeaturedProducts.emptyStateTitle')}
        products={streamableFeaturedProducts}
        title={t('FeaturedProducts.title')}
      />

      <FeaturedProductCarousel
        cta={{ label: t('NewestProducts.cta'), href: '/shop-all/?sort=newest' }}
        description={t('NewestProducts.description')}
        emptyStateSubtitle={t('NewestProducts.emptyStateSubtitle')}
        emptyStateTitle={t('NewestProducts.emptyStateTitle')}
        nextLabel={t('NewestProducts.nextProducts')}
        previousLabel={t('NewestProducts.previousProducts')}
        products={streamableNewestProducts}
        title={t('NewestProducts.title')}
      />

      {/* test section start */}
      <section className="w-full py-16 px-6 md:px-12 lg:px-20 bg-gray-50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          {/* Left Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Build Faster with Next.js
            </h2>

            <p className="text-gray-600 mb-6">
              Create modern, high-performance web applications using Next.js,
              TypeScript, and TailwindCSS. Ship faster with optimized UI and
              scalable architecture.
            </p>

            <button className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              Get Started
            </button>
          </div>

          {/* Right Content */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">Fast</h3>
              <p className="text-sm text-gray-500">
                Optimized performance out of the box.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">Scalable</h3>
              <p className="text-sm text-gray-500">
                Built for growth and flexibility.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">Secure</h3>
              <p className="text-sm text-gray-500">
                Production-ready security features.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
              <h3 className="font-semibold text-lg mb-2">SEO Friendly</h3>
              <p className="text-sm text-gray-500">
                Improve visibility on search engines.
              </p>
            </div>
          </div>

        </div>
      </section>
     
      
      {/* test section end */}
      
      <Stream fallback={null} value={streamableShowNewsletterSignup}>
        {(showNewsletterSignup) => showNewsletterSignup && <Subscribe />}
      </Stream>
    </>
  );
}
