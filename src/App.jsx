import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Canvas,
  useFrame,
} from "@react-three/fiber";

import {
  ContactShadows,
  Text,
  PerspectiveCamera,
} from "@react-three/drei";

import * as THREE from "three";

import {
  motion,
  AnimatePresence,
} from "framer-motion";

import { BRAND } from "../config/brand";
import {
  PRODUCTS,
  useStore,
} from "../store/useStore";

const money = (value) =>
  `${BRAND.currency}${value.toFixed(2)}`;

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.35} />

      <directionalLight
        position={[4, 8, 5]}
        intensity={2}
        castShadow
      />

      <pointLight
        position={[0, 3, -6]}
        intensity={4}
        distance={12}
        color="#ff2020"
      />

      <pointLight
        position={[-5, 4, 2]}
        intensity={2}
        distance={10}
        color="#ffffff"
      />
    </>
  );
}

function Logo3D() {
  return (
    <group>
      <Text
        position={[0, 3.5, -6]}
        fontSize={1}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {BRAND.name}
      </Text>

      <pointLight
        position={[0, 3, -5]}
        intensity={3}
        distance={8}
        color="#ff2020"
      />
    </group>
  );
}

function Rack({ position, index }) {
  const openRack = useStore(
    (state) => state.setRackOpen
  );

  const labels = [
    "ESSENTIALS",
    "DROP 01",
    "LIMITED",
    "ARCHIVE",
  ];

  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry
          args={[3, 0.12, 1]}
        />

        <meshStandardMaterial
          color="#242424"
          metalness={0.5}
          roughness={0.6}
        />
      </mesh>

      <mesh position={[0, 2, 0]}>
        <boxGeometry
          args={[3, 0.12, 0.12]}
        />

        <meshStandardMaterial color="#333" />
      </mesh>

      {[-0.95, -0.48, 0, 0.48, 0.95].map(
        (x, i) => (
          <mesh
            key={i}
            position={[x, 1.05, 0]}
            castShadow
            onClick={() => openRack(true)}
          >
            <boxGeometry
              args={[0.4, 1.6, 0.2]}
            />

            <meshStandardMaterial
              color={
                i % 2 === 0
                  ? "#151515"
                  : "#d7d7d7"
              }
              roughness={0.8}
            />
          </mesh>
        )
      )}

      <Text
        position={[0, 2.35, 0]}
        fontSize={0.22}
        color="#999"
        anchorX="center"
      >
        {labels[index]}
      </Text>
    </group>
  );
}

function StoreWorld() {
  return (
    <group>
      <mesh
        position={[0, -0.15, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[18, 0.3, 20]}
        />

        <meshStandardMaterial
          color="#101010"
          roughness={0.8}
        />
      </mesh>

      <mesh position={[0, 5, -5]}>
        <boxGeometry
          args={[18, 0.2, 12]}
        />

        <meshStandardMaterial color="#080808" />
      </mesh>

      <mesh position={[-9, 2.5, 0]}>
        <boxGeometry
          args={[0.2, 5, 20]}
        />

        <meshStandardMaterial color="#090909" />
      </mesh>

      <mesh position={[9, 2.5, 0]}>
        <boxGeometry
          args={[0.2, 5, 20]}
        />

        <meshStandardMaterial color="#090909" />
      </mesh>

      <mesh position={[0, 2.5, -10]}>
        <boxGeometry
          args={[18, 5, 0.2]}
        />

        <meshStandardMaterial color="#090909" />
      </mesh>

      <Logo3D />

      {[
        [-5, 0, -2],
        [-1, 0, -2],
        [3, 0, -2],
        [6, 0, -2],
      ].map((position, index) => (
        <Rack
          key={index}
          position={position}
          index={index}
        />
      ))}

      <mesh position={[6, 1.2, -7]}>
        <boxGeometry
          args={[2.8, 2.4, 0.8]}
        />

        <meshStandardMaterial
          color="#171717"
          metalness={0.4}
          roughness={0.5}
        />
      </mesh>

      <Text
        position={[6, 2.6, -7.45]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
      >
        CASHIER
      </Text>

      <mesh position={[-5, 2, -7]}>
        <boxGeometry
          args={[3.5, 4, 0.25]}
        />

        <meshStandardMaterial
          color="#202020"
        />
      </mesh>

      <Text
        position={[-5, 4.25, -7.2]}
        fontSize={0.28}
        color="#aaaaaa"
        anchorX="center"
      >
        BRAND PHOTO ROOM
      </Text>

      <mesh position={[0, 2.2, -8.8]}>
        <boxGeometry
          args={[2.5, 4, 0.2]}
        />

        <meshStandardMaterial
          color="#303030"
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      <Text
        position={[0, 4.3, -9]}
        fontSize={0.3}
        color="#ffffff"
        anchorX="center"
      >
        AUTHORIZED PERSONNEL ONLY
      </Text>
    </group>
  );
}

function Player() {
  const ref = useRef(null);
  const keys = useRef({});

  useEffect(() => {
    const down = (event) => {
      keys.current[
        event.key.toLowerCase()
      ] = true;
    };

    const up = (event) => {
      keys.current[
        event.key.toLowerCase()
      ] = false;
    };

    window.addEventListener(
      "keydown",
      down
    );

    window.addEventListener(
      "keyup",
      up
    );

    return () => {
      window.removeEventListener(
        "keydown",
        down
      );

      window.removeEventListener(
        "keyup",
        up
      );
    };
  }, []);

  useFrame((state, delta) => {
    if (!ref.current) return;

    const k = keys.current;

    const movement =
      new THREE.Vector3(
        (k.d ? 1 : 0) -
          (k.a ? 1 : 0),
        0,
        (k.s ? 1 : 0) -
          (k.w ? 1 : 0)
      );

    if (movement.length() > 0) {
      movement
        .normalize()
        .multiplyScalar(
          2.2 * delta
        );
    }

    ref.current.position.x =
      THREE.MathUtils.clamp(
        ref.current.position.x +
          movement.x,
        -7.5,
        7.5
      );

    ref.current.position.z =
      THREE.MathUtils.clamp(
        ref.current.position.z +
          movement.z,
        -8.5,
        8.5
      );

    state.camera.position.lerp(
      new THREE.Vector3(
        ref.current.position.x,
        1.7,
        ref.current.position.z + 3
      ),
      0.1
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
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <PerspectiveCamera
        makeDefault
        position={[0, 1.7, 10]}
        fov={60}
      />

      <Lighting />

      <StoreWorld />

      <Player />

      <ContactShadows
        position={[0, 0, 0]}
        opacity={0.45}
        scale={18}
        blur={2}
      />
    </Canvas>
  );
}

function Intro() {
  const setScreen = useStore(
    (state) => state.setScreen
  );

  const [ready, setReady] =
    useState(false);

  useEffect(() => {
    const timer = setTimeout(
      () => setReady(true),
      1800
    );

    return () =>
      clearTimeout(timer);
  }, []);

  return (
    <div className="intro">
      <motion.div
        className="logo"
        initial={{
          opacity: 0,
          filter: "blur(15px)",
        }}
        animate={{
          opacity: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.4,
        }}
      >
        {BRAND.name}
      </motion.div>

      <div className="introSub">
        A STORE EXPERIENCE
      </div>

      {ready && (
        <motion.div
          className="enterBtns"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <button
            onClick={() =>
              setScreen("store")
            }
          >
            ENTER STORE
          </button>

          <button
            className="ghost"
            onClick={() =>
              setScreen("shop")
            }
          >
            VIEW COLLECTION
          </button>
        </motion.div>
      )}
    </div>
  );
}

function Bag() {
  const bag = useStore(
    (state) => state.bag
  );

  const setCheckout = useStore(
    (state) => state.setCheckout
  );

  const count = bag.reduce(
    (total, item) =>
      total + item.qty,
    0
  );

  return (
    <button
      className="bag"
      onClick={() =>
        setCheckout(true)
      }
    >
      BAG <b>{count.toString().padStart(2, "0")}</b>
    </button>
  );
}

function RackPanel() {
  const open = useStore(
    (state) => state.rackOpen
  );

  const close = useStore(
    (state) => state.setRackOpen
  );

  const select = useStore(
    (state) =>
      state.setSelectedProduct
  );

  if (!open) return null;

  return (
    <div className="panel rackPanel">
      <button
        className="x"
        onClick={() => close(false)}
      >
        ×
      </button>

      <div className="eyebrow">
        EXPLORE
      </div>

      <h2>T-SHIRTS</h2>

      <div className="productRow">
        {PRODUCTS.map((product) => (
          <div
            className="productCard"
            key={product.id}
            onClick={() =>
              select(product)
            }
          >
            <div className="shirt3d">
              <div className="shirtMark">
                N
              </div>
            </div>

            <small>
              {product.collection}
            </small>

            <strong>
              {product.name}
            </strong>

            <span>
              {money(product.price)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductPanel() {
  const product = useStore(
    (state) =>
      state.selectedProduct
  );

  const select = useStore(
    (state) =>
      state.setSelectedProduct
  );

  const add = useStore(
    (state) => state.add
  );

  const [size, setSize] =
    useState("M");

  useEffect(() => {
    if (product?.sizes?.length) {
      setSize(
        product.sizes.includes("M")
          ? "M"
          : product.sizes[0]
      );
    }
  }, [product]);

  if (!product) return null;

  return (
    <div className="panel productPanel">
      <button
        className="x"
        onClick={() => select(null)}
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
          NOIR PRODUCT
        </div>
      </div>

      <div className="info">
        <div className="eyebrow">
          {product.collection} /{" "}
          {product.drop}
        </div>

        <h2>{product.name}</h2>

        <p>
          {product.description}
        </p>

        <div className="price">
          {money(product.price)}
        </div>

        <div className="label">
          SIZE
        </div>

        <div className="sizes">
          {product.sizes.map(
            (item) => (
              <button
                key={item}
                className={
                  item === size
                    ? "selected"
                    : ""
                }
                onClick={() =>
                  setSize(item)
                }
              >
                {item}
              </button>
            )
          )}
        </div>

        <button
          className="primary"
          onClick={() => {
            add(product, size);
            select(null);
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
    (state) => state.checkout
  );

  const close = useStore(
    (state) => state.setCheckout
  );

  const bag = useStore(
    (state) => state.bag
  );

  const customer = useStore(
    (state) => state.customer
  );

  const setCustomer = useStore(
    (state) => state.setCustomer
  );

  const setOrder = useStore(
    (state) => state.setOrder
  );

  if (!open) return null;

  const total = bag.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  function submit() {
    if (
      !customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city
    ) {
      alert(
        "Please complete your customer information."
      );
      return;
    }

    const id =
      "NOIR-" +
      Math.floor(
        1000 +
          Math.random() * 9000
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

    const previous =
      JSON.parse(
        localStorage.getItem(
          "noir-orders"
        ) || "[]"
      );

    localStorage.setItem(
      "noir-orders",
      JSON.stringify([
        ...previous,
        order,
      ])
    );

    setOrder(order);

    const lines = bag
      .map(
        (item) =>
          `${item.name} — ${item.color} — ${item.size} x${item.qty}`
      )
      .join("\n");

    const message =
      `Hello ${BRAND.name},\n\n` +
      `I would like to confirm my order.\n\n` +
      `Order: #${id}\n\n` +
      `Items:\n${lines}\n\n` +
      `Total: ${money(total)}\n` +
      `Customer: ${customer.name}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${customer.address}, ${customer.city}`;

    window.open(
      `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );

    close(false);

    alert(
      `ORDER RECEIVED\n${id}`
    );
  }

  return (
    <div className="modal">
      <div className="checkout">
        <button
          className="x"
          onClick={() =>
            close(false)
          }
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
          {bag.map((item) => (
            <div
              key={item.lineId}
            >
              <span>
                {item.name} /{" "}
                {item.size}
              </span>

              <b>
                {money(
                  item.price *
                    item.qty
                )}
              </b>
            </div>
          ))}
        </div>

        <div className="total">
          TOTAL
          <b>
            {money(total)}
          </b>
        </div>

        <div className="form">
          {[
            "name",
            "phone",
            "address",
            "city",
            "notes",
          ].map((key) => (
            <input
              key={key}
              placeholder={
                key === "name"
                  ? "Full Name"
                  : key
              }
              value={
                customer[key]
              }
              onChange={(event) =>
                setCustomer({
                  [key]:
                    event.target
                      .value,
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
  const setScreen = useStore(
    (state) => state.setScreen
  );

  const select = useStore(
    (state) =>
      state.setSelectedProduct
  );

  return (
    <div className="shop">
      <div className="top">
        <span>
          {BRAND.name}
        </span>

        <button
          onClick={() =>
            setScreen("store")
          }
        >
          ENTER 3D STORE
        </button>
      </div>

      <section className="shopHero">
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
      </section>

      <div className="grid">
        {PRODUCTS.map((product) => (
          <div
            className="shopItem"
            key={product.id}
          >
            <div
              className="shopShirt"
              onClick={() =>
                select(product)
              }
            >
              <div className="shirtMark">
                N
              </div>
            </div>

            <div>
              <span>
                {product.collection}
              </span>

              <h3>
                {product.name}
              </h3>

              <b>
                {money(
                  product.price
                )}
              </b>
            </div>

            <button
              onClick={() =>
                select(product)
              }
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
  const toggleSound =
    useStore(
      (state) =>
        state.toggleSound
    );

  return (
    <div className="store">
      <World />

      <div className="hud">
        <div className="brandHud">
          {BRAND.name}
        </div>

        <div className="hint">
          WASD · EXPLORE
        </div>

        <button
          className="sound"
          onClick={
            toggleSound
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
    (state) => state.screen
  );

  return (
    <AnimatePresence mode="wait">
      {screen === "intro" ? (
        <Intro key="intro" />
      ) : screen === "shop" ? (
        <Shop key="shop" />
      ) : (
        <StoreApp key="store" />
      )}
    </AnimatePresence>
  );
}
