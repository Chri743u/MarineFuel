import * as React from 'react';
import {Text, StyleSheet, TouchableOpacity,} from 'react-native';

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
        //Vi udpakker vores oprettede parametre, 'props'.
        const {id, onSelect} = this.props
        //Og 'onSelect' tager ID'et som vi har kaldt som argument.
        onSelect(id)
    };

    //render funktionen tager vores argument og præsenterer det på skærmen.
    //Indpakningsfunktionen 'TouchableOpacity' reagere på touch. Ved et touch tryk er gennemsigtigheden nedsat -
    //dvs. udseendesmæssigt dæmpes knappen.
    render() {
        const { station } = this.props;
        return (
                <TouchableOpacity style={styles.container} onPress={this.handlePress}>
                    <Text style={styles.StationText}>
                        {station.name}
                    </Text>
                    <Text style={styles.StationText}>
                        {station.diesel}
                    </Text>
                    <Text style={styles.StationText}>
                        {station.benzin}
                    </Text>
                </TouchableOpacity>
        );
    }
}
