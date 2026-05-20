import { useEffect, useState } from 'react';
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [item, setItem] = useState('');
  const [lista, setLista] = useState<any[]>([]);

  useEffect(() => {
    carregarItens();
  }, []);

  useEffect(() => {
    salvarItens();
  }, [lista]);

  async function salvarItens() {
    try {
      await AsyncStorage.setItem('@listaCompras', JSON.stringify(lista));
    } catch (error) {
      console.log(error);
    }
  }

  async function carregarItens() {
    try {
      const dados = await AsyncStorage.getItem('@listaCompras');

      if (dados !== null) {
        setLista(JSON.parse(dados));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function adicionarItem() {
    if (item.trim() === '') return;

    const novoItem = {
      id: Date.now().toString(),
      nome: item,
      comprado: false
    };

    setLista([...lista, novoItem]);
    setItem('');
  }

  function marcarComprado(id) {
    const novaLista = lista.map((produto) => {
      if (produto.id === id) {
        return {
          ...produto,
          comprado: !produto.comprado
        };
      }

      return produto;
    });

    setLista(novaLista);
  }

  function excluirItem(id) {
    const novaLista = lista.filter((produto) => produto.id !== id);
    setLista(novaLista);
  }

  function limparLista() {
    setLista([]);
  }

  const comprados = lista.filter(item => item.comprado).length;
  const pendentes = lista.length - comprados;

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Compras</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite um item"
        value={item}
        onChangeText={setItem}
      />

      <TouchableOpacity
        style={styles.botao}
        onPress={adicionarItem}
      >
        <Text style={styles.textoBotao}>Adicionar</Text>
      </TouchableOpacity>

      <Text style={styles.contador}>
        Comprados: {comprados} | Pendentes: {pendentes}
      </Text>

      <TouchableOpacity
        style={styles.botaoLimpar}
        onPress={limparLista}
      >
        <Text style={styles.textoBotao}>Limpar Lista</Text>
      </TouchableOpacity>

      <FlatList
        data={lista}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => marcarComprado(item.id)}
            >
              <Text
                style={[
                  styles.textoItem,
                  item.comprado && styles.itemComprado
                ]}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.botaoExcluir}
              onPress={() => excluirItem(item.id)}
            >
              <Text style={styles.textoExcluir}>X</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
    backgroundColor: '#fff'
  },

  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },

  input: {
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10
  },

  botao: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10
  },

  textoBotao: {
    color: '#fff',
    fontWeight: 'bold'
  },

  contador: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold'
  },

  botaoLimpar: {
    backgroundColor: '#f57c00',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10
  },

  textoItem: {
    fontSize: 18
  },

  itemComprado: {
    textDecorationLine: 'line-through',
    color: 'green'
  },

  botaoExcluir: {
    backgroundColor: 'red',
    width: 35,
    height: 35,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },

  textoExcluir: {
    color: '#fff',
    fontWeight: 'bold'
  }
});