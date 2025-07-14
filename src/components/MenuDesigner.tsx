import React, { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
  Cake,
  X,
  LogOut
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

const MenuDesigner: React.FC = () => {
  const { user, username, signOut } = useAuth();
  const { toast } = useToast();
  
  // 1) tutti gli useState
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);
  const [menuTitle, setMenuTitle] = useState("Il Nostro Menu");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // 2) ref e hook di stampa, ora con contentRef!
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: menuTitle,
    pageStyle: `
      @page { size: A4 portrait; margin: 20mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        .no-print { display: none !important; }
      }
    `
  });

  // 3) categorie di esempio
  const [categories, setCategories] = useState<MenuCategory[]>([
    {
      id: "antipasti",
      name: "Antipasti",
      icon: Utensils,
      items: [
        { id: "bruschetta", name: "Bruschetta Classica", description: "Pane tostato con pomodoro fresco, basilico e aglio", price: "8.00", category: "antipasti" },
        { id: "antipasto_mare", name: "Antipasto di Mare", description: "Selezione di crudi e marinati del giorno", price: "16.00", category: "antipasti" },
        { id: "tagliere", name: "Tagliere di Salumi e Formaggi", description: "Selezione di salumi locali e formaggi stagionati", price: "14.00", category: "antipasti" }
      ]
    },
    {
      id: "primi",
      name: "Primi Piatti",
      icon: ChefHat,
      items: [
        { id: "carbonara", name: "Spaghetti alla Carbonara", description: "La ricetta tradizionale romana con guanciale e pecorino", price: "12.00", category: "primi" },
        { id: "risotto_porcini", name: "Risotto ai Porcini", description: "Riso carnaroli con funghi porcini freschi", price: "15.00", category: "primi" },
        { id: "amatriciana", name: "Bucatini all'Amatriciana", description: "Pasta con guanciale, pomodoro San Marzano e pecorino", price: "11.00", category: "primi" }
      ]
    },
    {
      id: "secondi",
      name: "Secondi Piatti",
      icon: Utensils,
      items: [
        { id: "tagliata", name: "Tagliata di Manzo", description: "Carne di manzo con rucola e grana, cottura al sangue", price: "22.00", category: "secondi" },
        { id: "branzino", name: "Branzino in Crosta di Sale", description: "Pesce fresco del giorno cotto in crosta di sale", price: "18.00", category: "secondi" },
        { id: "ossobuco", name: "Ossobuco alla Milanese", description: "Tradizionale brasato lombardo con risotto giallo", price: "24.00", category: "secondi" }
      ]
    },
    {
      id: "dolci",
      name: "Dolci",
      icon: Cake,
      items: [
        { id: "tiramisu", name: "Tiramisù della Casa", description: "Il nostro tiramisù preparato secondo la ricetta tradizionale", price: "6.00", category: "dolci" },
        { id: "panna_cotta", name: "Panna Cotta ai Frutti di Bosco", description: "Dessert cremoso con salsa ai frutti di bosco freschi", price: "5.50", category: "dolci" }
      ]
    },
    {
      id: "bevande",
      name: "Bevande",
      icon: Wine,
      items: [
        { id: "vino_rosso", name: "Chianti Classico", description: "Vino rosso toscano DOCG", price: "25.00", category: "bevande" },
        { id: "acqua", name: "Acqua Naturale/Frizzante", description: "Bottiglia 0.75L", price: "2.50", category: "bevande" },
        { id: "caffe", name: "Caffè Espresso", description: "Miscela arabica italiana", price: "1.50", category: "bevande" }
      ]
    }
  ]);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      loadUserMenu();
    }
  }, [user]);

  const loadUserMenu = async () => {
    try {
      setLoading(true);

      // Load user's menu
      const { data: menu } = await supabase
        .from('menus')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (menu) {
        setMenuTitle(menu.title);

        // Load menu items
        const { data: menuItems } = await supabase
          .from('menu_items')
          .select('*')
          .eq('menu_id', menu.id);

        if (menuItems) {
          setSelectedItems(menuItems);
        }
      }
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveUserMenu = async () => {
    if (!user) return;

    try {
      setSaving(true);

      // Get or create user's menu
      let { data: menu } = await supabase
        .from('menus')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!menu) {
        const { data: newMenu, error } = await supabase
          .from('menus')
          .insert({ user_id: user.id, title: menuTitle })
          .select()
          .single();

        if (error) throw error;
        menu = newMenu;
      } else {
        // Update menu title
        await supabase
          .from('menus')
          .update({ title: menuTitle })
          .eq('id', menu.id);
      }

      // Delete existing menu items
      await supabase
        .from('menu_items')
        .delete()
        .eq('menu_id', menu.id);

      // Insert new menu items
      if (selectedItems.length > 0) {
        const menuItemsToInsert = selectedItems.map(item => ({
          menu_id: menu.id,
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category
        }));

        await supabase
          .from('menu_items')
          .insert(menuItemsToInsert);
      }

      toast({
        title: "Menu salvato",
        description: "Il tuo menu è stato salvato con successo!",
      });
    } catch (error) {
      console.error('Error saving menu:', error);
      toast({
        title: "Errore",
        description: "Errore durante il salvataggio del menu",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const addToMenu = (item: MenuItem) => {
    if (!selectedItems.some(s => s.id === item.id)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const removeFromMenu = (itemId: string) => {
    setSelectedItems(selectedItems.filter(it => it.id !== itemId));
  };

  const openEditDialog = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const openAddDialog = (categoryId: string) => {
    setCurrentItem({ id: "", name: "", description: "", price: "", category: categoryId });
    setIsEditing(false);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setCurrentItem(null);
    setIsEditing(false);
  };

  const saveItem = () => {
    if (!currentItem) return;
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id === currentItem.category) {
          if (isEditing) {
            return { ...cat, items: cat.items.map(it => it.id === currentItem.id ? currentItem : it) };
          } else {
            return { ...cat, items: [...cat.items, { ...currentItem, id: `${currentItem.category}_${Date.now()}` }] };
          }
        }
        return cat;
      })
    );
    if (isEditing) {
      setSelectedItems(prev => prev.map(it => it.id === currentItem.id ? currentItem : it));
    }
    closeDialog();
  };

  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter(it => it.id !== itemId) } : cat
      )
    );
    setSelectedItems(prev => prev.filter(it => it.id !== itemId));
  };

  const groupedMenuItems = selectedItems.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* header + bottoni no-print */}
      <header className="bg-gradient-primary text-primary-foreground p-6 shadow-elegant no-print">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ChefHat className="h-8 w-8"/>
            <div>
              <h1 className="text-2xl font-bold">Menu Designer</h1>
              {username && <p className="text-sm opacity-80">Benvenuto, {username}</p>}
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="gold" onClick={handlePrint}><Download className="h-4 w-4"/>Esporta PDF</Button>
            <Button variant="elegant" onClick={saveUserMenu} disabled={saving}>
              <Save className="h-4 w-4"/>
              {saving ? 'Salvando...' : 'Salva Menu'}
            </Button>
            <Button variant="outline" onClick={handleSignOut} className="text-primary-foreground border-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <LogOut className="h-4 w-4"/>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {loading ? (
        <div className="max-w-7xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <ChefHat className="h-16 w-16 mx-auto text-restaurant-gold animate-pulse mb-4" />
            <p className="text-restaurant-brown">Caricamento del tuo menu...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* sidebar no-print */}
          <div className="lg:col-span-1 no-print">
            <Card className="p-6 shadow-card animate-slide-in-left">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2"><Utensils className="h-5 w-5"/>Categorie Piatti</h2>
              <div className="space-y-6">
                {categories.map(cat => (
                  <div key={cat.id} className="space-y-3">
                    <div className="flex items-center gap-2 text-restaurant-brown font-medium"><cat.icon className="h-4 w-4"/>{cat.name}</div>
                    <div className="space-y-2 pl-6">
                      {cat.items.map(item => (
                        <div key={item.id} className="p-3 border border-border rounded-lg hover:border-restaurant-gold transition-colors bg-background group">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-sm">{item.name}</h4>
                            <div className="flex items-center gap-1">
                              <Badge variant="secondary" className="text-xs">€{item.price}</Badge>
                              <Button variant="ghost" size="sm" onClick={() => openEditDialog(item)} className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"><Edit3 className="h-3 w-3"/></Button>
                              <Button variant="ghost" size="sm" onClick={() => deleteItem(cat.id, item.id)} className="opacity-0 group-hover:opacity-100 text-destructive h-6 w-6 p-0"><X className="h-3 w-3"/></Button>
                            </div>
                          </div>
                          {item.description && <p className="text-xs text-muted-foreground mb-2">{item.description}</p>}
                          <Button size="sm" variant="outline" onClick={() => addToMenu(item)} className="w-full text-xs" disabled={selectedItems.some(s => s.id === item.id)}> <Plus className="h-3 w-3"/> {selectedItems.some(s => s.id === item.id) ? "Aggiunto" : "Aggiungi al Menu"} </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => openAddDialog(cat.id)} className="w-full text-xs mt-2 border-dashed"><Plus className="h-3 w-3"/>Aggiungi Nuovo Piatto</Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* sezione stampabile */}
          <div className="lg:col-span-2">
            <div ref={printRef}>
              <Card className="p-8 shadow-card animate-fade-in min-h-[600px]">
                {/* header menu */}
                <div className="text-center mb-8 pb-6 border-b-2 border-restaurant-gold">
                  <div className="flex items-center justify-center mb-4">
                    <input type="text" value={menuTitle} onChange={e => setMenuTitle(e.target.value)} className="text-3xl font-bold text-center bg-transparent border-none outline-none text-restaurant-brown"/>
                    <Edit3 className="h-4 w-4 ml-2 text-restaurant-warmgray"/>
                  </div>
                  <p className="text-restaurant-warmgray italic">Menu del giorno • Cucina tradizionale italiana</p>
                </div>
                {/* contenuto menu */}
                {selectedItems.length === 0 ? (
                  <div className="text-center py-12">
                    <ChefHat className="h-16 w-16 mx-auto text-restaurant-warmgray mb-4 animate-bounce-gentle"/>
                    <h3 className="text-xl font-medium text-restaurant-brown mb-2">Il tuo menu è vuoto</h3>
                    <p className="text-restaurant-warmgray">Seleziona dei piatti dalla sidebar per iniziare a creare il tuo menu</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {Object.entries(groupedMenuItems).map(([catId, items]) => {
                      const cat = categories.find(c => c.id === catId)!;
                      return (
                        <div key={catId}>
                          <div className="flex items-center gap-3 mb-4">
                            <cat.icon className="h-5 w-5 text-restaurant-gold"/>
                            <h3 className="text-xl font-semibold text-restaurant-brown uppercase tracking-wide">{cat.name}</h3>
                            <div className="flex-1 h-px bg-restaurant-gold"/>
                          </div>
                          <div className="space-y-4">
                            {items.map(item => (
                              <div key={item.id} className="group relative">
                                <div className="flex justify-between items-start">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h4 className="font-medium text-restaurant-brown">{item.name}</h4>
                                      <div className="flex-1 border-b border-dotted border-restaurant-warmgray"/>
                                      <span className="font-semibold text-restaurant-brown">€{item.price}</span>
                                    </div>
                                    {item.description && <p className="text-sm text-restaurant-warmgray italic">{item.description}</p>}
                                  </div>
                                  <Button variant="ghost" size="sm" onClick={() => removeFromMenu(item.id)} className="opacity-0 group-hover:opacity-100 ml-2"><Trash2 className="h-4 w-4"/></Button>
                                </div>
                              </div>
                            ))}
                          </div>
                          {Object.keys(groupedMenuItems).indexOf(catId) < Object.keys(groupedMenuItems).length - 1 && (
                            <Separator className="mt-6 bg-restaurant-gold"/>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* footer menu */}
                {selectedItems.length > 0 && (
                  <div className="mt-8 pt-6 border-t-2 border-restaurant-gold text-center">
                    <p className="text-sm text-restaurant-warmgray italic">Tutti i nostri piatti sono preparati con ingredienti freschi e di stagione</p>
                    <div className="flex items-center justify-center gap-4 mt-4 text-restaurant-warmgray"><Coffee className="h-4 w-4"/><span className="text-xs">Servizio al tavolo incluso</span><Wine className="h-4 w-4"/></div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* dialog modale no-print */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md no-print">
          <DialogHeader><DialogTitle>{isEditing ? "Modifica Piatto" : "Aggiungi Nuovo Piatto"}</DialogTitle></DialogHeader>
          {currentItem && (
            <div className="space-y-4">
              <div><Label htmlFor="name">Nome del piatto</Label><Input id="name" value={currentItem.name} onChange={e => setCurrentItem({ ...currentItem, name: e.target.value })} placeholder="Es. Spaghetti alla Carbonara"/></div>
              <div><Label htmlFor="description">Descrizione</Label><Textarea id="description" value={currentItem.description || ""} onChange={e => setCurrentItem({ ...currentItem, description: e.target.value })} placeholder="Descrivi gli ingredienti e la preparazione" rows={3}/></div>
              <div><Label htmlFor="price">Prezzo (€)</Label><Input id="price" type="number" step="0.50" value={currentItem.price} onChange={e => setCurrentItem({ ...currentItem, price: e.target.value })} placeholder="12.00"/></div>
              <div className="flex gap-2 pt-4">
                <Button onClick={saveItem} disabled={!currentItem.name || !currentItem.price} className="flex-1">{isEditing ? "Salva Modifiche" : "Aggiungi Piatto"}</Button>
                <Button variant="outline" onClick={closeDialog}>Annulla</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuDesigner;