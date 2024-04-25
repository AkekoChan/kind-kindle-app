import { useCallback, useEffect, useState } from "react";
import TopBar from "../../components/topbar/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { APIHandler } from "../../utils/api/api-handler";
import { Flami } from "../../interfaces/flami.interface";
import { CosmeticList } from "../../interfaces/cosmeticList.interface";
import { Cosmetic } from "../../interfaces/cosmetic.interface";
import FlamiDisplay from "../../components/flami/FlamiDisplay";
import { motion } from "framer-motion";
import { ArrowLeftIcon, ArrowRightIcon } from "react-line-awesome";
import toast from "react-hot-toast";

const CosmeticPage = () => {
  const { token } = useAuth();
  const [flami, setFlami] = useState<Flami>();

  const [cosmetics, setCosmetics] = useState<CosmeticList>();

  const [cosmeticList, setCosmeticList] = useState<{
    type: String;
    list: Cosmetic[];
  }>({ type: "head", list: [] });

  const [wornCosmetics, setWornCosmetics] = useState<Cosmetic[]>();

  const getFlami = useCallback(() => {
    APIHandler<Flami[]>("/my/flami", false, "GET", undefined, token).then(
      (res) => {
        setFlami(res.data[0]);
        setWornCosmetics(res.data[0].cosmetics);
      }
    );
  }, [token]);

  const getCosmetics = useCallback(() => {
    APIHandler<{ cosmetics: CosmeticList }>(
      "/my/cosmetics",
      false,
      "GET",
      undefined,
      token
    ).then((res) => {
      setCosmetics(res.data.cosmetics);
      setCosmeticList({
        type: "head",
        list: res.data.cosmetics.head,
      });
    });
  }, [token]);

  useEffect(() => {
    getFlami();
    getCosmetics();
  }, [getFlami, getCosmetics]);

  function equipCosmetic(cosmetic: Cosmetic) {
    console.log(cosmetic);
    if (!wornCosmetics) return;
    if (
      wornCosmetics.findIndex(
        (item) => item.category === cosmetic.category && item.id !== cosmetic.id
      ) !== -1
    )
      return toast.error(
        "Impossible d'équiper plusieures cosmétiques du même type.",
        {
          style: {
            background: "#3D3D3D",
            color: "#FAFAFA",
            borderRadius: "12px",
          },
        }
      );
    APIHandler<Flami>(
      "/my/flami/equip",
      false,
      "PATCH",
      { cosmetic_id: cosmetic.id },
      token
    ).then((res) => {
      setFlami(res.data);
      setWornCosmetics(res.data.cosmetics);
      setAnimation("Atchoum");
      setTimeout(() => setAnimation("Idle"), 10);
    });
  }

  const [animation, setAnimation] = useState("Idle");
  const [currentList, setCurrentList] = useState<number>(0);
  function showCosmeticList(i: number) {
    if (!cosmetics) return;
    let lists = {
      head: cosmetics.head,
      hands: cosmetics.hands,
      feet: cosmetics.feet,
      back: cosmetics.back,
    };
    let l = currentList + i;
    l =
      l < 0
        ? Object.keys(lists).length - 1
        : l > Object.keys(lists).length - 1
        ? 0
        : l;
    setCurrentList(l);
    console.log(l);
    setCosmeticList({
      type: Object.keys(lists)[l],
      list: Object.values(lists)[l],
    });
  }

  const variants = {
    owned:
      "rounded-md bg-alabaster-400 border-4 border-alabaster-500 w-24 h-24 px-2 py-2",
    equipped:
      "rounded-md bg-alabaster-400 border-4 border-tree-poppy-500 w-24 h-24 px-2 py-2",
    unowned:
      "rounded-md bg-alabaster-700 border-4 border-alabaster-500 w-24 h-24 px-2 py-2 cursor-not-allowed opacity-60",
  };

  return (
    <section className="flex flex-col gap-6 mb-24">
      <TopBar title="Modifier mon flami" hasReturn={true} prevPage="/" />
      {flami ? (
        <FlamiDisplay isSelf={true} animation={animation} flami={flami} />
      ) : null}
      <div className="grid grid-cols-1/2/1 gap-4 w-full mb-12">
        <button
          onClick={() => showCosmeticList(-1)}
          className="rounded-md bg-alabaster-700 hover:bg-alabaster-900 hover:border-tree-poppy-500 focus:bg-alabaster-900 focus:border-tree-poppy-500 border-4 border-alabaster-500 px-2 py-2"
        >
          <ArrowLeftIcon className="text-xl"></ArrowLeftIcon>
        </button>
        <div className="flex justify-center">
          <img
            className="h-12"
            src={`/assets/img/icons/cosmetics/${cosmeticList.type}.png`}
          />
        </div>
        <button
          onClick={() => showCosmeticList(1)}
          className="rounded-md bg-alabaster-700 hover:bg-alabaster-900 hover:border-tree-poppy-500 focus:bg-alabaster-900 focus:border-tree-poppy-500 border-4 border-alabaster-500 px-2 py-2"
        >
          <ArrowRightIcon className="text-xl"></ArrowRightIcon>
        </button>
      </div>
      <div className="grid grid-cols-3 place-items-center gap-x-6 gap-y-4">
        {cosmeticList?.list.map((cosmetic) => (
          <motion.button
            onClick={
              cosmetic.owned ? () => equipCosmetic(cosmetic) : () => null
            }
            className={
              cosmetic.owned
                ? wornCosmetics?.find((cosm) => cosm.id === cosmetic.id)
                  ? variants.equipped
                  : variants.owned
                : variants.unowned
            }
            key={cosmetic.id}
          >
            <img
              className="object-contain w-full h-full"
              src={cosmetic.url}
              loading="eager"
            />
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default CosmeticPage;
