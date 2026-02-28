import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductPage from "./components/product/table/page";
import RawMaterialPage from "./components/rawmaterial-table/table/page";

export function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start p-4 sm:justify-center">
      <Tabs defaultValue="products" className="w-full max-w-5xl">
        <TabsList>
          <TabsTrigger id="ProductTrigger" value="products">
            Products
          </TabsTrigger>
          <TabsTrigger id="RawMaterialTrigger" value="raw-materials">
            Raw Materials
          </TabsTrigger>
        </TabsList>
        <TabsContent value="products">
          <ProductPage />
        </TabsContent>
        <TabsContent value="raw-materials">
          <RawMaterialPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
