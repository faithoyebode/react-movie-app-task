import { useState, useRef, useEffect} from 'react';
import { Box, Input, FormControl, FormLabel, Image, Text, Flex} from '@chakra-ui/react';

const SearchResults = () => {

    const [movies, setMovies] = useState({});
    const [loadingMovies, setLoadingMovies] = useState(false);
    const [err, setError] = useState(false);


    const [series, setSeries] = useState({});
    const [loadingSeries, setLoadingSeries] = useState(false);

    const searchTextRef = useRef();

    const handleSubmit = async (e) => {

        try {
            setError(false);
            setLoadingMovies(true);
            setLoadingSeries(true);
            const [ moviesResults, seriesResults ] = await Promise.all([
                    fetch(`https://omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=${e.target.value}&type=movie&page=1`),
                    fetch(`https://omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=${e.target.value}&type=series&page=1`)
            ]);
            const [moviesData, seriesData] = [await moviesResults.json(), await seriesResults.json()];
            if(moviesData?.Response?.toLowerCase() === "false" || seriesData?.Response?.toLowerCase() === "false"){
                throw new Error();
            }
            setMovies((prevData) => ({...prevData, ...moviesData, page: 1}));
            setSeries((prevData) => ({...prevData, ...seriesData, page: 1}));
            setLoadingMovies(false);
            setLoadingSeries(false);
        } catch (error) {
            setLoadingMovies(false);
            setLoadingSeries(false);
            setMovies({});
            setSeries({});
            setError(true);    
        }
    }

    const handleScroll = async (e, stateItem, setStateItem, setLoading, category) => {
        setError(false);
        if((e.target.scrollLeft + e.target.clientWidth >= e.target.scrollWidth - 30) && (stateItem.page * 10 < Number(stateItem.totalResults))){
            try{
                setLoading(true);
                const page = stateItem.page + 1;
                const response = await fetch(`https://omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=${searchTextRef.current.value}&type=${category}&page=${page}`);
                const data = await response.json();
                setStateItem((prevData) => ({
                    ...data,
                    page: page,
                    Search: [...prevData?.Search, ...data?.Search]
                }));
                setLoading(false);
            }catch (error) {
                setError(true);
                setLoading(false);
            }
        } 
    }

    useEffect(() => {
        setError(false);
        searchTextRef.current.value = "game";
        let firstController = new AbortController();
        let secondController = new AbortController();

        (async () => {
            try {
                setLoadingMovies(true);
                setLoadingSeries(true);
                const [ moviesResults, seriesResults ] = await Promise.all([
                        fetch(`https://omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=game&type=movie&page=1`, {
                            signal: firstController.signal
                        }),
                        fetch(`https://omdbapi.com/?apikey=${process.env.REACT_APP_KEY}&s=game&type=series&page=1`, {
                            signal: secondController.signal
                        }),
                ]);
                const [moviesData, seriesData] = [await moviesResults.json(), await seriesResults.json()];
                if(moviesData?.Response?.toLowerCase() === "false" || seriesData?.Response?.toLowerCase() === "false"){
                    throw new Error();
                }
                setMovies((prevData) => ({...prevData, ...moviesData, page: 1}));
                setSeries((prevData) => ({...prevData, ...seriesData, page: 1}));
                setLoadingMovies(false);
                setLoadingSeries(false);
            } catch (error) {
                if(!firstController.signal.aborted  && !secondController.signal.aborted){
                    setLoadingMovies(false);
                    setLoadingSeries(false);
                    setMovies({});
                    setSeries({});
                    setError(true);    
                }
            }
        })()
        return () => {
            firstController.abort();
            secondController.abort();
        }
    }, []);

    return (
        <Box py={{base: '63px'}} px={{base: '28px', md: '77px'}}>
            <form onSubmit={handleSubmit}>
                <FormControl id="search" mb="48px">
                    <FormLabel fontFamily="DM Sans" fontSize={{base: "16px", md: "24px"}}>Search</FormLabel>
                    <Input type="text" borderColor="#000000" borderRadius="0" onChange={handleSubmit} ref={searchTextRef} />
                </FormControl>
            </form>

            <Box mb="48px">
                <Text mb="18px" fontFamily="DM Sans" fontSize={{base: "18px", md: "24px"}}>Movies</Text>
                <Flex 
                    w="100%" 
                    mb="10px" 
                    overflowX="auto" 
                    overflowY="hidden" 
                    onScroll={async (e) => {await handleScroll(e, movies, setMovies, setLoadingMovies, "movie")}}
                    className="scroll-container"
                >
                    {
                        movies?.Search?.map((item, i) => (
                            <Box key={i+1} h={{base: "200px", md: "300px"}} flexShrink="0" flexBasis={{base: "200px", md: "300px"}} mr="13px" position="relative" borderRadius="12px" className="movie-box">
                                <Image src={item.Poster} w="100%" h="100%" objectFit="cover" borderRadius="12px" />
                                <Text color="#ffffff" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="3" fontFamily="DM Sans" fontSize={{base: "18px", md: "24px"}} w="60%" textAlign="center">{item.Title}</Text>
                            </Box>
                        ))
                    }
                    { loadingMovies && <span className="loader"></span>}
                    { err && <Text flexShrink="0" fontSize={{base: "18px", md: "24px"}} color="red">An error occured</Text>}
                </Flex>
            </Box>

            <Box mb="48px">
                <Text mb="18px" fontFamily="DM Sans" fontSize={{base: "18px", md: "24px"}}>Series</Text>
                <Flex 
                    w="100%" 
                    mb="10px" 
                    overflowX="auto" 
                    overflowY="hidden" 
                    onScroll={async (e) => {await handleScroll(e, series, setSeries, setLoadingSeries, "series")}}
                    className="scroll-container"
                >
                    {
                        series?.Search?.map((item, i) => (
                            <Box key={i+1} h={{base: "200px", md: "300px"}} flexShrink="0" flexBasis={{base: "200px", md: "300px"}} mr="13px" position="relative" borderRadius="12px" className="movie-box">
                                <Image src={item.Poster} w="100%" h="100%" objectFit="cover" borderRadius="12px" />
                                <Text color="#ffffff" position="absolute" top="50%" left="50%" transform="translate(-50%, -50%)" zIndex="3" fontFamily="DM Sans" fontSize={{base: "18px", md: "24px"}} w="60%" textAlign="center">{item.Title}</Text>
                            </Box>
                        ))
                    }
                    { loadingSeries && <span className="loader"></span>}
                    { err && <Text flexShrink="0" fontSize={{base: "18px", md: "24px"}} color="red">An error occured</Text>}
                </Flex>
            </Box>
        </Box>
    )
}

export default SearchResults;