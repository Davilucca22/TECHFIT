import { useCallback } from "react";

function obterStorage() {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("localStorage não está disponível neste ambiente.");
  }

  return window.localStorage;
}

function validarChave(chave) {
  if (typeof chave !== "string" || !chave.trim()) {
    throw new TypeError("A chave do localStorage deve ser uma string não vazia.");
  }
}

function serializar(dados) {
  const valor = JSON.stringify(dados);
  if (valor === undefined) {
    throw new TypeError("Os dados precisam ser serializáveis em JSON.");
  }

  return valor;
}

function lerValor(storage, chave) {
  const valor = storage.getItem(chave);
  if (valor === null) return null;

  try {
    return JSON.parse(valor);
  } catch {
    throw new Error(`O valor salvo na chave "${chave}" não contém um JSON válido.`);
  }
}

export default function useCache() {
  const criar = useCallback((chave, dados) => {
    validarChave(chave);
    const storage = obterStorage();

    if (storage.getItem(chave) !== null) {
      throw new Error(`Já existe um valor salvo na chave "${chave}".`);
    }

    storage.setItem(chave, serializar(dados));
    return dados;
  }, []);

  const buscar = useCallback((chave) => {
    validarChave(chave);
    return lerValor(obterStorage(), chave);
  }, []);

  const modificar = useCallback((chave, dados) => {
    validarChave(chave);
    const storage = obterStorage();

    if (storage.getItem(chave) === null) {
      throw new Error(`Não existe um valor salvo na chave "${chave}" para modificar.`);
    }

    storage.setItem(chave, serializar(dados));
    return dados;
  }, []);

  const excluir = useCallback((chave) => {
    validarChave(chave);
    const storage = obterStorage();

    if (storage.getItem(chave) === null) return false;

    storage.removeItem(chave);
    return true;
  }, []);

  return { criar, buscar, modificar, excluir };
}
