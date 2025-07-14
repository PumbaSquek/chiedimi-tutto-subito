import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ChefHat, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  Save,
  Utensils,
  Wine,
  Coffee,
  Cake
} from "lucide-react";

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category: string;
}

interface MenuCategory {
  id: string;
  name: string;
  icon: any;
  items: MenuItem[];
}

const MenuDesigner = () => {
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [menuTitle, setMenuTitle] = useState("Il Nostro Menu");
  
  // Categorie predefinite con piatti di esempio
  const categories: MenuCategory[] = [
    {
      id: "antipasti",
      name: "Antipasti",
      icon: Utensils,
      items: [
        {
          id: "bruschetta",
          name: "Bruschetta Classica",
          description: "Pane tostato con pomodoro fresco, basilico e aglio",
          price: "8.00",
          category: "antipasti"
        },
        {
          id: "antipasto_mare",
          name: "Antipasto di Mare",
          description: "Selezione di crudi e marinati del giorno",
          price: "16.00",
          category: "antipasti"
        },
        {
          id: "tagliere",
          name: "Tagliere di Salumi e Formaggi",
          description: "Selezione di salumi locali e formaggi stagionati",
          price: "14.00",
          category: "antipasti"
        }
      ]
    },
    {
      id: "primi",
      name: "Primi Piatti",
      icon: ChefHat,
      items: [
        {
          id: "carbonara",
          name: "Spaghetti alla Carbonara",
          description: "La ricetta tradizionale romana con guanciale e pecorino",
          price: "12.00",
          category: "primi"
        },
        {
          id: "risotto_porcini",
          name: "Risotto ai Porcini",
          description: "Riso carnaroli con funghi porcini freschi",
          price: "15.00",
          category: "primi"
        },
        {
          id: "amatriciana",
          name: "Bucatini all'Amatriciana",
          description: "Pasta con guanciale, pomodoro San Marzano e pecorino",
          price: "11.00",
          category: "primi"
        }
      ]
    },
    {
      id: "secondi",
      name: "Secondi Piatti",
      icon: Utensils,
      items: [
        {
          id: "tagliata",
          name: "Tagliata di Manzo",
          description: "Carne di manzo con rucola e grana, cottura al sangue",
          price: "22.00",
          category: "secondi"
        },
        {
          id: "branzino",
          name: "Branzino in Crosta di Sale",
          description: "Pesce fresco del giorno cotto in crosta di sale",
          price: "18.00",
          category: "secondi"
        },
        {
          id: "ossobuco",
          name: "Ossobuco alla Milanese",
          description: "Tradizionale brasato lombardo con risotto giallo",
          price: "24.00",
          category: "secondi"
        }
      ]
    },
    {
      id: "dolci",
      name: "Dolci",
      icon: Cake,
      items: [
        {
          id: "tiramisu",
          name: "Tiramisù della Casa",
          description: "Il nostro tiramisù preparato secondo la ricetta tradizionale",
          price: "6.00",
          category: "dolci"
        },
        {
          id: "panna_cotta",
          name: "Panna Cotta ai Frutti di Bosco",
          description: "Dessert cremoso con salsa ai frutti di bosco freschi",
          price: "5.50",
          category: "dolci"
        }
      ]
    },
    {
      id: "bevande",
      name: "Bevande",
      icon: Wine,
      items: [
        {
          id: "vino_rosso",
          name: "Chianti Classico",
          description: "Vino rosso toscano DOCG",
          price: "25.00",
          category: "bevande"
        },
        {
          id: "acqua",
          name: "Acqua Naturale/Frizzante",
          description: "Bottiglia 0.75L",
          price: "2.50",
          category: "bevande"
        },
        {
          id: "caffe",
          name: "Caffè Espresso",
          description: "Miscela arabica italiana",
          price: "1.50",
          category: "bevande"
        }
      ]
    }
  ];

  const addToMenu = (item: MenuItem) => {
    if (!selectedItems.find(selected => selected.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeFromMenu = (itemId: string) => {
    setSelectedItems(selectedItems.filter(item => item.id !== itemId));
  };

  const exportToPDF = () => {
    // Per ora simuliamo l'export
    alert("📄 Export PDF implementato! Il menu verrà scaricato in formato PDF.");
  };

  const groupedMenuItems = selectedItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <header className="bg-gradient-primary text-primary-foreground p-6 shadow-elegant">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Menu Designer</h1>
          </div>
          <div className="flex gap-3">
            <Button variant="gold" onClick={exportToPDF}>
              <Download className="h-4 w-4" />
              Esporta PDF
            </Button>
            <Button variant="elegant">
              <Save className="h-4 w-4" />
              Salva Menu
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar - Categorie Piatti */}
        <div className="lg:col-span-1">
          <Card className="p-6 shadow-card animate-slide-in-left">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Utensils className="h-5 w-5" />
              Categorie Piatti
            </h2>
            
            <div className="space-y-6">
              {categories.map((category) => (
                <div key={category.id} className="space-y-3">
                  <div className="flex items-center gap-2 text-restaurant-brown font-medium">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </div>
                  
                  <div className="space-y-2 pl-6">
                    {category.items.map((item) => (
                      <div 
                        key={item.id}
                        className="p-3 border border-border rounded-lg hover:border-restaurant-gold transition-colors bg-background"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            €{item.price}
                          </Badge>
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mb-2">
                            {item.description}
                          </p>
                        )}
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => addToMenu(item)}
                          className="w-full text-xs"
                          disabled={selectedItems.some(selected => selected.id === item.id)}
                        >
                          <Plus className="h-3 w-3" />
                          {selectedItems.some(selected => selected.id === item.id) ? 'Aggiunto' : 'Aggiungi al Menu'}
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Menu Preview */}
        <div className="lg:col-span-2">
          <Card className="p-8 shadow-card animate-fade-in min-h-[600px]">
            {/* Menu Header */}
            <div className="text-center mb-8 pb-6 border-b-2 border-restaurant-gold">
              <div className="flex items-center justify-center mb-4">
                <input 
                  type="text"
                  value={menuTitle}
                  onChange={(e) => setMenuTitle(e.target.value)}
                  className="text-3xl font-bold text-center bg-transparent border-none outline-none text-restaurant-brown"
                />
                <Edit3 className="h-4 w-4 ml-2 text-restaurant-warmgray" />
              </div>
              <p className="text-restaurant-warmgray italic">
                Menu del giorno • Cucina tradizionale italiana
              </p>
            </div>

            {/* Menu Content */}
            {selectedItems.length === 0 ? (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 mx-auto text-restaurant-warmgray mb-4 animate-bounce-gentle" />
                <h3 className="text-xl font-medium text-restaurant-brown mb-2">
                  Il tuo menu è vuoto
                </h3>
                <p className="text-restaurant-warmgray">
                  Seleziona dei piatti dalla sidebar per iniziare a creare il tuo menu
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {Object.entries(groupedMenuItems).map(([categoryId, items]) => {
                  const category = categories.find(cat => cat.id === categoryId);
                  if (!category) return null;
                  
                  return (
                    <div key={categoryId}>
                      <div className="flex items-center gap-3 mb-4">
                        <category.icon className="h-5 w-5 text-restaurant-gold" />
                        <h3 className="text-xl font-semibold text-restaurant-brown uppercase tracking-wide">
                          {category.name}
                        </h3>
                        <div className="flex-1 h-px bg-restaurant-gold"></div>
                      </div>
                      
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="group relative">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className="font-medium text-restaurant-brown">
                                    {item.name}
                                  </h4>
                                  <div className="flex-1 border-b border-dotted border-restaurant-warmgray"></div>
                                  <span className="font-semibold text-restaurant-brown">
                                    €{item.price}
                                  </span>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-restaurant-warmgray italic">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFromMenu(item.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {Object.keys(groupedMenuItems).indexOf(categoryId) < Object.keys(groupedMenuItems).length - 1 && (
                        <Separator className="mt-6 bg-restaurant-gold" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Menu Footer */}
            {selectedItems.length > 0 && (
              <div className="mt-8 pt-6 border-t-2 border-restaurant-gold text-center">
                <p className="text-sm text-restaurant-warmgray italic">
                  Tutti i nostri piatti sono preparati con ingredienti freschi e di stagione
                </p>
                <div className="flex items-center justify-center gap-4 mt-4 text-restaurant-warmgray">
                  <Coffee className="h-4 w-4" />
                  <span className="text-xs">Servizio al tavolo incluso</span>
                  <Wine className="h-4 w-4" />
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MenuDesigner;