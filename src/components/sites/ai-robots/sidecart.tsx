"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { asset } from "./data";
import { PrimaryButton } from "./primitives";
import { DIALOG_TRANSITION_MS, useDialogPresence } from "./use-dialog";

const transition = `${DIALOG_TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`;

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount);

// The source cart is backed by a Shopify session; a fresh visitor always sees the empty cart, reproduced here.
export function Sidecart() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const { mounted, visible } = useDialogPresence(open, close);

  return (
    <>
      <button
        aria-label="Click to open the cart"
        className={open ? "cart-trigger active" : "cart-trigger"}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={() => setOpen(!open)}
      >
        <img src={asset("/icons/bag.svg")} alt="Cart" width={21} height={21} />
      </button>
      {mounted &&
        createPortal(
          <>
            <div id="sidecart" style={{ opacity: visible ? 1 : 0, transition: `opacity ${transition}` }} onClick={close} />
            <div
              className="cart"
              role="dialog"
              aria-modal="true"
              aria-label="Shopping Cart"
              style={{ transform: `translateX(${visible ? "0%" : "100%"})`, opacity: visible ? 1 : 0, transition: `transform ${transition}, opacity ${transition}` }}
            >
              <div className="head">
                <span className="subtitle-3 color-white">Your cart</span>
                <button type="button" className="flex-center" aria-label="Click to close the cart" onClick={close}>
                  <img src={asset("/icons/close_cart.png")} alt="" loading="lazy" />
                </button>
              </div>
              <div className="cart-list">
                <div className="empty-cart">
                  <p className="paragraph-1 color-white">Your cart is empty</p>
                </div>
              </div>
              <div className="checkout">
                <div className="total">
                  <span>subtotal</span>
                  <p>{formatPrice(0)}</p>
                </div>
                <PrimaryButton disabled>checkout</PrimaryButton>
                <Link
                  className="continue"
                  href="/"
                  onClick={(event) => {
                    event.preventDefault();
                    close();
                  }}
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </>,
          document.body,
        )}
    </>
  );
}
