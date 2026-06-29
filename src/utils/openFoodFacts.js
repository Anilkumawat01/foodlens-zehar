/**
 * Open Food Facts API Proxy Utility for FoodLens
 */

/**
 * Fetches a product from Open Food Facts by its barcode via the Vite CORS proxy.
 * @param {string} barcode 
 * @returns {Promise<object>} The parsed product information or null if not found.
 */
export async function fetchProductByBarcode(barcode) {
  const cleanBarcode = barcode.trim();
  if (!cleanBarcode) throw new Error("Barcode is empty");

  const url = `/api/food/api/v2/product/${cleanBarcode}.json`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open Food Facts API error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.status === 1 && data.product) {
      const p = data.product;
      
      // Standardize the product object fields
      return {
        barcode: cleanBarcode,
        name: p.product_name || p.product_name_en || "Unknown Product",
        brand: p.brands || p.brand_owner || "Unknown Brand",
        ingredients_text: p.ingredients_text || p.ingredients_text_en || "",
        image: p.image_front_url || p.image_url || p.image_front_small_url || "",
        nutrition_grades: p.nutrition_grades || p.nutrition_grade_fr || "",
        nova_group: p.nova_group || p.nova_groups || null,
        ecoscore_grade: p.ecoscore_grade || p.ecoscore_grades || "",
        allergens: p.allergens || p.allergens_from_ingredients || "",
        additives_tags: p.additives_tags || [],
        nutriments: {
          calories: p.nutriments?.['energy-kcal_100g'] || p.nutriments?.energy_100g || 0,
          fat: p.nutriments?.fat_100g || 0,
          saturated_fat: p.nutriments?.['saturated-fat_100g'] || p.nutriments?.['saturated-fat'] || 0,
          sugars: p.nutriments?.sugars_100g || 0,
          salt: p.nutriments?.salt_100g || 0,
          sodium: p.nutriments?.sodium_100g || 0,
          protein: p.nutriments?.proteins_100g || 0,
          fiber: p.nutriments?.fiber_100g || 0
        }
      };
    }
    
    return null; // Product not found
  } catch (error) {
    console.error("Error in fetchProductByBarcode:", error);
    throw error;
  }
}

/**
 * Searches for products in Open Food Facts by name/query via the Vite CORS proxy.
 * @param {string} query 
 * @returns {Promise<Array>} List of matching products.
 */
export async function searchProducts(query) {
  const cleanQuery = query.trim();
  if (!cleanQuery) return [];

  const url = `/api/search/cgi/search.pl?search_terms=${encodeURIComponent(cleanQuery)}&search_simple=1&action=process&json=1&page_size=10`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Open Food Facts API Search error: HTTP ${response.status}`);
    }
    
    const data = await response.json();
    if (!data.products) return [];

    // Filter and format the results
    return data.products
      .filter(p => p.product_name || p.product_name_en)
      .map(p => ({
        barcode: p.code || p.id,
        name: p.product_name || p.product_name_en || "Unknown Product",
        brand: p.brands || "Unknown Brand",
        image: p.image_front_url || p.image_front_small_url || p.image_url || "",
        ingredients_text: p.ingredients_text || p.ingredients_text_en || "",
        nutrition_grades: p.nutrition_grades || p.nutrition_grade_fr || "",
        nova_group: p.nova_group || p.nova_groups || null,
        ecoscore_grade: p.ecoscore_grade || p.ecoscore_grades || "",
        allergens: p.allergens || p.allergens_from_ingredients || "",
        additives_tags: p.additives_tags || [],
        nutriments: {
          calories: p.nutriments?.['energy-kcal_100g'] || p.nutriments?.energy_100g || 0,
          fat: p.nutriments?.fat_100g || 0,
          saturated_fat: p.nutriments?.['saturated-fat_100g'] || p.nutriments?.['saturated-fat'] || 0,
          sugars: p.nutriments?.sugars_100g || 0,
          salt: p.nutriments?.salt_100g || 0,
          sodium: p.nutriments?.sodium_100g || 0,
          protein: p.nutriments?.proteins_100g || 0,
          fiber: p.nutriments?.fiber_100g || 0
        }
      }));
  } catch (error) {
    console.error("Error in searchProducts:", error);
    throw error;
  }
}
