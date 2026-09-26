import React, { useEffect, useRef, useState } from "react";
import {
  Canvas,
  useFrame,
} from "@react-three/fiber";
import {
  Environment,
  ContactShadows,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

import { BRAND } from "../config/brand";
import { PRODUCTS, useStore } from "../store/useStore";

const fmt = (n) => `${BRAND.currency}${n.toFixed(2)}`;

function Neon() {
  return (
    <group>
      <Text
        position={[0, 3.3, -5]}
        fontSize={1.05}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {BRAND.name}
      </Text>

      <pointLight
        position={[0, 3.2, -4.7]}
        color="#ff2020"
        intensity={2}
        distance={5}
      />
    </group>
  );
}

function Store() {
  return (
    <group>
      <mesh position={[0, -0.12, 0]} receiveShadow>
        <boxGeometry args={[18, 0.2, 20]} />
        <meshStandardMaterial
          color="#101010"
          roughness={0.72}
        />
      </mesh>

      <mesh position={[0, 5, -4]} receiveShadow>
        <boxGeometry args={[18, 0.2, 12]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      <mesh position={[-9, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      <mesh position={[9, 2.5, 0]}>
        <boxGeometry args={[0.2, 5, 20]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      <mesh position={[0, 2.5, -10]}>
        <boxGeometry args={[18, 5, 0.2]} />
        <meshStandardMaterial color="#090909" />
      </mesh>

      <Neon />

      {[
        [-5, 2, -2],
        [-1, 2, -2],
        [3, 2, -2],
        [6, 2, -2],
      ].map((p, i) => (
        <Rack key={i} pos={p} idx={i} />
      ))}

      <mesh position={[6, 1.2, -7]} castShadow>
        <boxGeometry args={[2.6, 2.4, 0.8]} />
        <meshStandardMaterial
          color="#171717"
          metalness={0.35}
          roughness={0.5}
        />
      </mesh>

      <Text
        position={[6, 2.6, -7.45]}
        fontSize={0.32}
        color="white"
        anchorX="center"
      >
        CASHIER
      </Text>

      <mesh position={[-5, 2, -7]}>
        <boxGeometry args={[3.5, 4, 0.25]} />
        <meshStandardMaterial
          color="#202020"
          metalness={0.2}
          roughness={0.2}
        />
      </mesh>

      <Text
        position={[-5, 4.25, -7.2]}
        fontSize={0.3}
        color="#aaa"
        anchorX="center"
      >
        BRAND PHOTO ROOM
      </Text>

      <mesh position={[0, 2.2, -8.8]}>
        <boxGeometry args={[2.5, 4, 0.2]} />
        <meshStandardMaterial
          color="#303030"
          metalness={0.7}
          roughness={0.15}
        />
      </mesh>

      <Text
        position={[0, 4.3, -9]}
        fontSize={0.35}
        color="#fff"
        anchorX="center"
      >
        AUTHORIZED PERSONNEL ONLY
      </Text>
    </group>
  );
}

function Rack({ pos, idx }) {
  const open = useStore((s) => s.setRackOpen);

  return (
    <group position={pos}>
      <mesh castShadow>
        <boxGeometry args={[2.8, 0.12, 1]} />
        <meshStandardMaterial
          color="#252525"
          metalness={0.5}
        />
      </mesh>

      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[2.8, 0.12, 0.12]} />
        <meshStandardMaterial color="#333" />
      </mesh>

      {[-0.9, -0.45, 0, 0.45, 0.9].map((x, j) => (
        <mesh
          key={j}
          position={[x, 1.05, 0]}
          castShadow
          onClick={() => open(true)}
        >
          <boxGeometry args={[0.38, 1.65, 0.18]} />
          <meshStandardMaterial
            color={j % 2 ? "#d7d7d7" : "#151515"}
            roughness={0.8}
          />
        </mesh>
      ))}

      <Text
        position={[0, 2.35, 0]}
        fontSize={0.24}
        color="#aaa"
        anchorX="center"
      >
        {["ESSENTIALS", "DROP 01", "LIMITED", "ARCHIVE"][idx]}
      </Text>
    </group>
  );
}

function Player() {
  const ref = useRef();
  const keys = useRef({});

  useEffect(() => {
    const d = (e) => {
      keys.current[e.key.toLowerCase()] = true;
    };

    const u = (e) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    addEventListener("keydown", d);
    addEventListener("keyup", u);

    return () => {
      removeEventListener("keydown", d);
      removeEventListener("keyup", u);
    };
  }, []);

  useFrame((st, dt) => {
    if (!ref.current) return;

    const k = keys.current;

    const s = new THREE.Vector3(
      (k.d ? 1 : 0) - (k.a ? 1 : 0),
      0,
      (k.s ? 1 : 0) - (k.w ? 1 : 0)
    );

    if (s.length()) {
      s.normalize().multiplyScalar(2.1 * dt);
    }

    ref.current.position.x = THREE.MathUtils.clamp(
      ref.current.position.x + s.x,
      -7.5,
      7.5
    );

    ref.current.position.z = THREE.MathUtils.clamp(
      ref.current.position.z + s.z,
      -8.5,
      8.5
    );

    st.camera.position.lerp(
      new THREE.Vector3(
        ref.current.position.x,
        1.65,
        ref.current.position.z + 2.8
      ),
      0.12
    );
  });

  return (
    <group
      ref={ref}
      position={[0, 0, 7]}
    />
  );
}

function World() {
  return (
    <Canvas shadows dpr={[1, 1.5]}>
      <PerspectiveCamera
        makeDefault
        position={[0, 1.65, 9]}
        fov={60}
      />

      <ambientLight intensity={0.22} />

      <directionalLight
        position={[0, 7, 4]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      <Store />
      <Player />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.5}
        scale={18}
        blur={2}
      />

      <Environment preset="warehouse" />
    </Canvas>
  );
}

function Intro() {
  const set = useStore((s) => s.setScreen);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 1200);
    const b = setTimeout(() => setPhase(2), 2700);

    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <div className="intro">
      <motion.div
        className="logo"
        initial={{
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.5,
        }}
      >
        {BRAND.name}
      </motion.div>

      {phase >= 1 && (
        <motion.div
          className="introSub"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          A STORE EXPERIENCE
        </motion.div>
      )}

      {phase >= 2 && (
        <motion.div className="enterBtns">
          <button onClick={() => set("store")}>
            ENTER STORE
          </button>

          <button
            className="ghost"
            onClick={() => set("shop")}
          >
            VIEW COLLECTION
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Bag() {
  const bag = useStore((s) => s.bag);
  const setCheckout = useStore(
    (s) => s.setCheckout
  );

  return (
    <div
      className="bag"
      onClick={() => setCheckout(true)}
    >
      BAG
      <b>
        {bag
          .reduce((a, x) => a + x.qty, 0)
          .toString()
          .padStart(2, "0")}
      </b>
    </div>
  );
}

function RackPanel() {
  const open = useStore((s) => s.rackOpen);
  const set = useStore((s) => s.setRackOpen);
  const sel = useStore(
    (s) => s.setSelectedProduct
  );

  if (!open) return null;

  return (
    <div className="panel rackPanel">
      <button
        className="x"
        onClick={() => set(false)}
      >
        ×
      </button>

      <div className="eyebrow">
        EXPLORE
      </div>

      <h2>T-SHIRTS</h2>

      <div className="productRow">
        {PRODUCTS.map((p) => (
          <div
            className="productCard"
            key={p.id}
            onClick={() => sel(p)}
          >
            <div className="shirt3d">
              <div className="shirtMark">
                N
              </div>
            </div>

            <small>{p.collection}</small>
            <strong>{p.name}</strong>
            <span>{fmt(p.price)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPanel() {
  const p = useStore(
    (s) => s.selectedProduct
  );

  const sel = useStore(
    (s) => s.setSelectedProduct
  );

  const add = useStore((s) => s.add);

  const [size, setSize] = useState(
    p?.sizes?.[2] || "M"
  );

  if (!p) return null;

  return (
    <div className="panel productPanel">
      <button
        className="x"
        onClick={() => sel(null)}
      >
        ×
      </button>

      <div className="viewer">
        <div className="largeShirt">
          <div className="shirtMark">
            N
          </div>
        </div>

        <div className="viewerHint">
          DRAG / ROTATE / INSPECT
        </div>
      </div>

      <div className="info">
        <div className="eyebrow">
          {p.collection} / {p.drop}
        </div>

        <h2>{p.name}</h2>

        <p>{p.description}</p>

        <div className="price">
          {fmt(p.price)}
        </div>

        <div className="label">
          SIZE
        </div>

        <div className="sizes">
          {p.sizes.map((s) => (
            <button
              className={
                s === size
                  ? "selected"
                  : ""
              }
              key={s}
              onClick={() => setSize(s)}
            >
              {s}
            </button>
          ))}
        </div>

        <button
          className="primary"
          onClick={() => {
            add(p, size);
            sel(null);
          }}
        >
          ADD TO BAG
        </button>
      </div>
    </div>
  );
}

function Checkout() {
  const open = useStore(
    (s) => s.checkout
  );

  const setOpen = useStore(
    (s) => s.setCheckout
  );

  const bag = useStore((s) => s.bag);

  const customer = useStore(
    (s) => s.customer
  );

  const setCustomer = useStore(
    (s) => s.setCustomer
  );

  const setOrder = useStore(
    (s) => s.setOrder
  );

  if (!open) return null;

  const total = bag.reduce(
    (a, x) => a + x.price * x.qty,
    0
  );

  async function submit() {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city
    ) {
      return alert(
        "Please complete your customer information."
      );
    }

    const id =
      "NOIR-" +
      Math.floor(
        1000 + Math.random() * 9000
      );

    const order = {
      id,
      customer,
      items: bag,
      total,
      status:
        "WAITING_FOR_CONFIRMATION",
      createdAt:
        new Date().toISOString(),
    };

    localStorage.setItem(
      "noir-orders",
      JSON.stringify([
        ...JSON.parse(
          localStorage.getItem(
            "noir-orders"
          ) || "[]"
        ),
        order,
      ])
    );

    setOrder(order);

    const lines = bag
      .map(
        (x) =>
          `${x.name} — ${x.color} — ${x.size} x${x.qty}`
      )
      .join("\n");

    const msg =
      `Hello ${BRAND.name},\n\n` +
      `I would like to confirm my order.\n\n` +
      `Order: #${id}\n\n` +
      `Items:\n${lines}\n\n` +
      `Total: ${fmt(total)}\n` +
      `Customer: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}, ${customer.city}\n` +
      `${
        customer.notes
          ? `Notes: ${customer.notes}`
          : ""
      }`;

    window.open(
      `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
        msg
      )}`,
      "_blank"
    );

    setOpen(false);

    alert(`ORDER RECEIVED\n${id}`);
  }

  return (
    <div className="modal">
      <div className="checkout">
        <button
          className="x"
          onClick={() => setOpen(false)}
        >
          ×
        </button>

        <div className="eyebrow">
          CASHIER
        </div>

        <h2>
          YOUR ORDER IS READY
        </h2>

        <div className="box">
          NOIR
        </div>

        <div className="orderItems">
          {bag.map((x) => (
            <div key={x.lineId}>
              <span>
                {x.name} / {x.size}
              </span>

              <b>
                {fmt(x.price * x.qty)}
              </b>
            </div>
          ))}
        </div>

        <div className="total">
          TOTAL
          <b>{fmt(total)}</b>
        </div>

        <div className="form">
          {[
            "name",
            "phone",
            "address",
            "city",
            "notes",
          ].map((k) => (
            <input
              key={k}
              placeholder={
                k === "name"
                  ? "Full Name"
                  : k[0].toUpperCase() +
                    k.slice(1)
              }
              value={customer[k]}
              onChange={(e) =>
                setCustomer({
                  [k]: e.target.value,
                })
              }
            />
          ))}
        </div>

        <button
          className="primary"
          onClick={submit}
        >
          CONFIRM VIA WHATSAPP
        </button>
      </div>
    </div>
  );
}

function Shop() {
  const set = useStore(
    (s) => s.setScreen
  );

  const sel = useStore(
    (s) => s.setSelectedProduct
  );

  return (
    <div className="shop">
      <div className="top">
        <span>{BRAND.name}</span>

        <button
          onClick={() => set("store")}
        >
          ENTER 3D STORE
        </button>
      </div>

      <div className="shopHero">
        <div className="eyebrow">
          DROP 01
        </div>

        <h1>
          THE COLLECTION
        </h1>

        <p>
          Premium essentials,
          experienced in three
          dimensions.
        </p>
      </div>

      <div className="grid">
        {PRODUCTS.map((p) => (
          <div
            className="shopItem"
            key={p.id}
          >
            <div
              className="shopShirt"
              onClick={() => sel(p)}
            >
              <div className="shirtMark">
                N
              </div>
            </div>

            <div>
              <span>
                {p.collection}
              </span>

              <h3>{p.name}</h3>

              <b>{fmt(p.price)}</b>
            </div>

            <button
              onClick={() => sel(p)}
            >
              VIEW
            </button>
          </div>
        ))}
      </div>

      <Bag />
      <ProductPanel />
      <Checkout />
    </div>
  );
}

function StoreApp() {
  return (
    <div className="store">
      <World />

      <div className="hud">
        <div className="brandHud">
          {BRAND.name}
        </div>

        <div className="hint">
          WASD · MOUSE · EXPLORE
        </div>

        <button
          className="sound"
          onClick={() =>
            useStore
              .getState()
              .toggleSound()
          }
        >
          SFX
        </button>
      </div>

      <Bag />

      <div className="cross">
        +
      </div>

      <RackPanel />
      <ProductPanel />
      <Checkout />
    </div>
  );
}

export default function App() {
  const screen = useStore(
    (s) => s.screen
  );

  return (
    <AnimatePresence mode="wait">
      {screen === "intro" ? (
        <Intro key="i" />
      ) : screen === "shop" ? (
        <Shop key="s" />
      ) : (
        <StoreApp key="w" />
      )}
    </AnimatePresence>
  );
}
