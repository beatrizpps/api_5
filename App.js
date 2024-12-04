import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

export default function App() {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length > 0) {
      
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1000`);
          const data = await response.json();
          const filteredSuggestions = data.results.filter((p) =>
            p.name.toLowerCase().includes(search.toLowerCase())
          );
          setSuggestions(filteredSuggestions.slice(0, 5)); 
        } catch (error) {
          console.error('Erro ao buscar sugestões:', error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [search]);

  const fetchPokemon = async (name) => {
    setLoading(true);
    setPokemon(null);
    setSearch(name); 
    setSuggestions([]); 
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`);
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Erro ao buscar Pokémon:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pokédex</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do Pokémon"
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => fetchPokemon(item.name)}>
              <Text style={styles.suggestion}>{item.name}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsList}
        />
      )}
      {loading && <ActivityIndicator size="large" color="#ffcc00" />}
      {pokemon && (
        <View style={styles.pokemonCard}>
          <Text style={styles.pokemonName}>{pokemon.name.toUpperCase()}</Text>
          <Image
            source={{ uri: pokemon.sprites?.front_default }}
            style={styles.pokemonImage}
          />
          <Text>Altura: {pokemon.height}</Text>
          <Text>Peso: {pokemon.weight}</Text>
          <Text>Base Experience: {pokemon.base_experience}</Text>
          <Text>Habilidades:</Text>
          <FlatList
            data={pokemon.abilities}
            keyExtractor={(item) => item.ability.name}
            renderItem={({ item }) => (
              <Text style={styles.ability}>- {item.ability.name}</Text>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff0000',
    padding: 16,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  input: {
    width: '100%',
    maxWidth: 400,
    height: 40,
    borderColor: '#ffcc00',
    borderWidth: 2,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20, 
    backgroundColor: '#fff',
    color: '#333',
  },
  suggestionsList: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 1, 
  },
  suggestion: {
    backgroundColor: '#ffcc00',
    color: '#fff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    textAlign: 'center',
  },
  pokemonCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
    alignItems: 'center',
    width: '90%',
    maxWidth: 400,
  },
  pokemonName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    color: '#ff0000',
  },
  pokemonImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  ability: {
    fontSize: 14,
    color: '#333',
  },
});
