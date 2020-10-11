
import * as React from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        padding: 13,
        borderWidth: 1,
        margin: 5,
        justifyContent:'space-between',
    },
    StationText: { width: 245,},
});

export default class StationDetails extends React.Component {
    handlePress = () => {
        // Her pakker vi ting ud fra props
        const {id, onSelect} = this.props
        // Kalder den onSelect prop vi får, med det ID vi har fået som argument.
        onSelect(id)
    };

    render() {
        const { station } = this.props;
        return (
                <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                    <Text style={styles.StationText}>
                        {station.name}
                    </Text>
                    <Text style={styles.StationText}>
                        {station.price}
                    </Text>
                </TouchableOpacity>
        );
    }
}
