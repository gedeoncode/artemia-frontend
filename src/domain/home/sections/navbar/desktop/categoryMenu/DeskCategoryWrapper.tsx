import { CategoryNode } from "@/domain/home/services/nodeCategories.services";
import { CategoryMenu, CategoryMenuConfig, CategoryMenuController, getCategoryUrl } from ".";
import { logger } from "@/lib/logger";
type DeskCategoryWrapperProps = {
  rootCategories: CategoryNode[];
  menu:   CategoryMenuController;
  config?: CategoryMenuConfig;
};
export function DeskCategoryWrapper({
  menu,
  searchFocused,
  rootCategories,
}: DeskCategoryWrapperProps & { searchFocused: boolean }) {

  const isVisible = !menu.isMobile && !searchFocused;
  return (
    <>
      {isVisible && (
        <div
          className="hidden lg:block layout-container "
        >
          <div >
            <CategoryMenu
              rootCategories={rootCategories}
              menu={menu}
              config={{
                persistLastPath: true,
                getCategoryHref: getCategoryUrl,

                getFeaturedLinks: (category) => {
                  if (!category) return [];

                  return [
                    {
                      label: `New in ${category.name}`,
                      href: `/products/categories/${category.slug ?? category._id}?sort=new`,
                    },
                    {
                      label: `Best Sellers`,
                      href: `/products/categories/${category.slug ?? category._id}?sort=popular`,
                    },
                    {
                      label: `Top Deals`,
                      href: `/products/categories/${category.slug ?? category._id}?discount=true`,
                    },
                  ];
                },

                onAnalyticsEvent: (event) => {
                  logger.info("[CategoryMenu Analytics]", event);
                },
              }}
            />
          </div>
        </div>
      )}
   </>
  );
}