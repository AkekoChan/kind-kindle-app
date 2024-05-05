import { useCallback, useEffect, useState } from "react";
import FlamiDisplay from "../../components/flami/FlamiDisplay";
import TopBar from "../../components/topbar/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { Flami } from "../../interfaces/flami.interface";
import { APIHandler } from "../../utils/api/api-handler";

const CollectionPage = () => {
  const { token } = useAuth();
  const [collection, setCollection] = useState<Flami[]>([]);
  const getCollection = useCallback(() => {
    APIHandler<Flami[]>("/my/collection", false, "GET", undefined, token).then(
      (res) => {
        setCollection(res.data);
      }
    );
  }, [token]);

  useEffect(() => {
    getCollection();
  }, [getCollection]);

  return (
    <section className="flex flex-col gap-6 mb-24">
      <TopBar title="Ta collection de Flamis" hasReturn={false} prevPage="" />
      { collection.length === 0 ? (<div>
          <span className="absolute text-xl mb-16">Tu n'as pas encore de Flamis dans ta collection !</span>
        </div>) : null }
      <div className="grid grid-cols-3 gap-6 w-full text-xs pt-4">
        { collection?.map(flami => (
          <FlamiDisplay isSelf={false} animation="Idle" flami={flami}></FlamiDisplay>
        )) }
        {
          [...Array(9 - collection.length).keys()].map((i) => 
            (<img
              key={i}
              loading="lazy"
              src={`/assets/img/icons/flami.png`}
              className={`relative z-10 w-full scale-65 translate-y-2 max-h-60 grayscale ${i > 3 ? `opacity-${30 - (i - 4) * 5}` : "opacity-30"}`}
              alt="Flami"
            />)
          )
        }
        {
          <span className="h-0 opacity-25 opacity-20 opacity-15 opacity-10 opacity-0"></span>
        }
      </div>
    </section>
  );
};

export default CollectionPage;
