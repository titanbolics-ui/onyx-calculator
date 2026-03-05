export interface Compound {
  id: string;
  name: string;
  halfLife: number;
}

export const COMPOUNDS: Compound[] = [
  { id: "test-p", name: "Testosterone Propionate (Test P)", halfLife: 0.8 },
  { id: "test-e", name: "Testosterone Enanthate (Test E)", halfLife: 4.5 },
  { id: "test-c", name: "Testosterone Cypionate (Test C)", halfLife: 8.0 },
  { id: "tren-a", name: "Trenbolone Acetate (Tren A)", halfLife: 1.0 },
  { id: "tren-e", name: "Trenbolone Enanthate (Tren E)", halfLife: 5.0 },
  { id: "mast-p", name: "Drostanolone Propionate (Masteron P)", halfLife: 0.8 },
  { id: "mast-e", name: "Drostanolone Enanthate (Masteron E)", halfLife: 5.0 },
  { id: "deca", name: "Nandrolone Decanoate (Deca)", halfLife: 14.0 },
  { id: "npp", name: "Nandrolone Phenylpropionate (NPP)", halfLife: 2.5 },
];
