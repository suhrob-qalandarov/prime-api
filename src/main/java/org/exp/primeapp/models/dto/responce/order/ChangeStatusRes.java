package org.exp.primeapp.models.dto.responce.order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.exp.primeapp.models.enums.OrderStatus;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ChangeStatusRes {
    private OrderStatus status;
}
